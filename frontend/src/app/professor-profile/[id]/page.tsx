/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios, { all } from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Award,
  Briefcase,
  Globe,
  GraduationCap,
  Video,
  BookOpen,
  Plus,
  User,
  Loader2,
  Bell,
  Building,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
  BookX,
  Calendar,
  X,
  FileText,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/components/shared/Footer";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { PROFESSORPAGE } from "../../../../public";
import EnrolledProjectsTabs from "@/components/shared/EnrolledProjectsTab";
import GlobalChatBox from "@/components/shared/GlobalChatBox";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ProjectCategories } from "@/lib/pre-define-data";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ProjectList from "@/components/ProfessorProjectsTab/ProjectList";

// Interface definitions for various data types used throughout the component
interface AppliedApplicant {
  id: string;
  professorId: string;
  studentId: string;
  businessId: string;
  name: string;
  email: string;
  description: string;
  resume: string;
  status: "PENDING" | "ACCEPTED" | "IN_REVIEW";
}

interface ApplicationsResponse {
  professorApplications: AppliedApplicant[];
  studentApplications: AppliedApplicant[];
  businessApplications: AppliedApplicant[];
}

interface Professor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  photoUrl: string;
  title: string;
  university: string;
  website: string;
  googleScholar: string;
  bio: string;
  degree: string;
  department: string;
  position: string;
  researchInterests: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string[];
  }>;
  positions: Array<{
    id: string;
    title: string;
    institution: string;
    startYear: string;
    endYear?: string;
    current: boolean;
  }>;
  achievements: Array<{ id: string; year: string; description: string }>;
  blogs: any;
  projects: Project[];
  tags: Array<{
    category: string;
    subcategory: string;
  }>;
}

interface Project {
  createdAt: string | number | Date;
  id: string;
  topic: string;
  content: string;
  requirements: string;
  techDescription: string;
  difficulty?: "EASY" | "INTERMEDIATE" | "HARD";
  timeline?: string;
  tags: string[];
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: "PROFESSOR_PROJECT" | "STUDENT_PROPOSAL" | "BUSINESS_PROJECT";
  category:
    | "PROFESSOR_COLLABORATION"
    | "INDUSTRY_COLLABORATION"
    | "INTERNSHIP"
    | "PHD_POSITION"
    | "RND_PROJECT";
  professor?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    university: string;
    department: string;
  };
  deadline?: string;
  duration?: string;
}

interface ProjectCategories {
  industryCollaboration: Project[];
  professorCollaboration: Project[];
  internship: Project[];
  rndProject: Project[];
  phdPosition: Project[];
}

type Notification = {
  id: string;
  type: "COMMENT" | "LIKE" | "DISLIKE";
  content: string;
  createdAt: string;
  isRead: boolean;
  professorId: string;
  blogId?: string;
  webinarId?: string;
  discussionId?: string;
  projectId?: string;
  redirectionLink?: string;
};

interface Webinar {
  id: string;
  title: string;
  topic: string;
  place: string;
  date: string;
  maxAttendees: number;
  duration: number;
  isOnline: boolean;
  meetingLink?: string;
  address?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  webinarImage?: string;
  webinarDocument?: string;
}

interface ResearchInterest {
  id: string;
  title: string;
  description?: string;
  imageUrl: string[];
  professorId: string;
}

interface ResearchInterestsProps {
  professor: {
    researchInterests: ResearchInterest[];
  };
}

const categories = ProjectCategories;

// Main component for displaying a professor's profile page
const ProfessorProfilePage: React.FC = () => {
  // State management using React hooks
  const { id } = useParams(); // Get professor ID from URL parameters
  const [professor, setProfessor] = useState<Professor | null>(null); // Store professor data
  const [webinars, setWebinars] = useState<Webinar[]>([]); // Store webinar data
  const [isWebinarDialogOpen, setIsWebinarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [appliedApplicantsMap, setAppliedApplicantsMap] = useState<{
    [projectId: string]: AppliedApplicant[];
  }>({});
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<{
    [projectId: string]: boolean;
  }>({});
  const [collaborationType, setCollaborationType] = useState("");
  const [studentOpportunityType, setStudentOpportunityType] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [place, setPlace] = useState("");
  const searchParams = useSearchParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectIDToDelete, setProjectIDToDelete] = useState<string | null>(
    null
  );
  const [webinarCreationLoading, setWebinarCreationLoading] = useState(false);
  const { toast } = useToast();

  const [categorizedProjects, setCategorizedProjects] =
    useState<ProjectCategories>({
      industryCollaboration: [],
      professorCollaboration: [],
      internship: [],
      rndProject: [],
      phdPosition: [],
    });

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const router = useRouter();

  // Effect hook to fetch professor data on component mount
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");
        setIsLoggedInUser(id === loggedInUserId);

        const professorResponse = await axios.get(
          `${API_URL}/professors/${id}`
        );
        setProfessor(professorResponse.data);

        if (isLoggedInUser && token) {
          const [webinarsResponse, notificationsResponse] = await Promise.all([
            axios.get(`${API_URL}/webinars/professor/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/notifications/professor/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setWebinars(webinarsResponse.data);
          setNotifications(notificationsResponse.data);
          setUnreadCount(
            notificationsResponse.data.filter((n: any) => !n.isRead).length
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessorData();
  }, [id, isLoggedInUser]);

  // Effect hook to categorize projects based on their category
  useEffect(() => {
    const handleCategorization = () => {
      const newCategories: ProjectCategories = {
        industryCollaboration: [],
        professorCollaboration: [],
        internship: [],
        rndProject: [],
        phdPosition: [],
      };

      professor?.projects?.forEach((project: Project) => {
        switch (project.category) {
          case "INDUSTRY_COLLABORATION":
            newCategories.industryCollaboration.push(project);
            break;
          case "PROFESSOR_COLLABORATION":
            newCategories.professorCollaboration.push(project);
            break;
          case "INTERNSHIP":
            newCategories.internship.push(project);
            break;
          case "RND_PROJECT":
            newCategories.rndProject.push(project);
            break;
          case "PHD_POSITION":
            newCategories.phdPosition.push(project);
            break;
          default:
            break;
        }
      });

      setCategorizedProjects(newCategories);
    };
    handleCategorization();
  }, [professor]);

  useEffect(() => {
    const openChat = searchParams.get("openChat");
    if (openChat === "true") {
      setIsChatOpen(true);
    }
  }, [searchParams]);

  // Handler for fetching applicants for a specific project
  const fetchAppliedApplicants = async (projectId: string) => {
    setIsLoadingApplicants((prev) => ({ ...prev, [projectId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApplicationsResponse>(
        `${API_URL}/project/${projectId}/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allApplications: AppliedApplicant[] = [
        ...response.data.professorApplications,
        ...response.data.studentApplications,
        ...response.data.businessApplications,
      ];

      // Check if there's any accepted applicant
      const acceptedApplicant = allApplications.find(
        (app) => app.status === "ACCEPTED"
      );

      // If there's an accepted applicant, only show that one
      const applicantsToShow = acceptedApplicant
        ? [acceptedApplicant]
        : allApplications;

      setAppliedApplicantsMap((prevMap) => ({
        ...prevMap,
        [projectId]: applicantsToShow,
      }));
    } catch (error) {
      console.error("Error fetching applied applicants:", error);
      setError("Failed to fetch applied applicants. Please try again.");
    } finally {
      setIsLoadingApplicants((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  // Toggle visibility of applicants list for a project
  const toggleApplicants = (projectId: string) => {
    if (appliedApplicantsMap[projectId]) {
      setAppliedApplicantsMap((prevMap) => {
        const newMap = { ...prevMap };
        delete newMap[projectId];
        return newMap;
      });
    } else {
      fetchAppliedApplicants(projectId);
    }
  };

  // Handler for assigning an applicant to a project
  const handleAssignApplicant = async (
    projectId: string,
    applicantId: string,
    applicantType: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/project/${projectId}/assign`,
        {
          applicationId: applicantId,
          applicationType: applicantType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the UI state
      setAppliedApplicantsMap((prevMap) => ({
        ...prevMap,
        [projectId]: prevMap[projectId].map((applicant) =>
          applicant.id === applicantId
            ? { ...applicant, status: "ACCEPTED" }
            : applicant
        ),
      }));

      setProfessor((prevProfessor) => {
        if (!prevProfessor) return prevProfessor;
        return {
          ...prevProfessor,
          projects: prevProfessor.projects.map((project) =>
            project.id === projectId
              ? { ...project, status: "ONGOING" }
              : project
          ),
        };
      });
    } catch (error) {
      console.error("Error assigning applicant:", error);
      setError("Failed to assign applicant. Please try again.");
    }
  };

  // Handler for rejecting an applicant
  const handleRejectApplicant = async (
    projectId: string,
    applicantId: string,
    applicantType: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/project/${projectId}/reject`,
        {
          applicationId: applicantId,
          applicationType: applicantType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove the rejected applicant from the UI
      setAppliedApplicantsMap((prevMap) => {
        const updatedMap = { ...prevMap };
        // Filter out the rejected applicant
        updatedMap[projectId] = prevMap[projectId].filter(
          (applicant) => applicant.id !== applicantId
        );
        return updatedMap;
      });
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      setError("Failed to reject applicant. Please try again.");
    }
  };

  // Handler for setting application status to in review
  const handleSetInReview = async (
    projectId: string,
    applicantId: string,
    applicantType: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/project/${projectId}/review`,
        {
          applicationId: applicantId,
          applicationType: applicantType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the UI state
      setAppliedApplicantsMap((prevMap) => ({
        ...prevMap,
        [projectId]: prevMap[projectId].map((applicant) =>
          applicant.id === applicantId
            ? { ...applicant, status: "IN_REVIEW" }
            : applicant
        ),
      }));
    } catch (error) {
      console.error("Error setting application to review:", error);
      setError("Failed to set application to review. Please try again.");
    }
  };

  // Handler for marking a project as complete
  const handleCompleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/project/${projectId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessor((prevProfessor) => {
        if (!prevProfessor) return prevProfessor;
        return {
          ...prevProfessor,
          projects: prevProfessor.projects.map((project) =>
            project.id === projectId
              ? { ...project, status: "CLOSED" }
              : project
          ),
        };
      });
    } catch (error) {
      console.error("Error completing project:", error);
      setError("Failed to complete project. Please try again.");
    }
  };

  // Handler for marking notifications as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read. Please try again.");
    }
  };

  // Handler for creating new webinars
  const handleCreateWebinar = async (
    webinarData: any,
    webinarImage: File | null,
    webinarDocument: File | null
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      setWebinarCreationLoading(true);

      // First check professor's approval status
      const professorResponse = await axios.get(`${API_URL}/professors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!professorResponse.data.isApproved) {
        alert(
          "Your profile has not been approved by admin yet. Please wait for approval before creating webinars."
        );
        setWebinarCreationLoading(false);
        setIsWebinarDialogOpen(false);
        return;
      }

      const formData = new FormData();

      // Append webinar data
      Object.keys(webinarData).forEach((key) => {
        formData.append(key, webinarData[key]);
      });

      // Append image if it exists
      if (webinarImage) {
        formData.append("webinarImage", webinarImage);
      }

      // Append document if it exists
      if (webinarDocument) {
        formData.append("webinarDocument", webinarDocument);
      }

      const response = await axios.post(`${API_URL}/webinars`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("Server response:", response.data);

      setWebinars((prevWebinars) => [...prevWebinars, response.data]);
      setIsWebinarDialogOpen(false);
      setWebinarCreationLoading(false);
    } catch (error) {
      console.error("Error creating webinar:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
      }
      setError("Failed to create webinar. Please try again.");
    }
  };

  // Handler for updating webinar status
  const handleUpdateWebinarStatus = async (
    webinarId: string,
    newStatus: "COMPLETED" | "CANCELLED"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/webinars/${webinarId}/professor-status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWebinars(
        webinars.map((w) => (w.id === webinarId ? response.data : w))
      );
    } catch (error) {
      console.error("Error updating webinar status:", error);
      setError("Failed to update webinar status. Please try again.");
    }
  };

  // Handler for initiating contact with the professor
  const handleContact = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${API_URL}/chat/rooms`,
        {
          userOneId: id,
          userOneType: "professor",
          userTwoId: localStorage.getItem("userId"),
          userTwoType: localStorage.getItem("role"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        router.push(
          `/${localStorage.getItem("role")}-profile/${localStorage.getItem(
            "userId"
          )}?openChat=true`
        );
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      setError(error.message);
    }
  };

  // Handler for creating new projects
  const handleCreateProject = async (projectData: any) => {
    setIsCreatingProject(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = `${API_URL}/project`;
      let data = {};

      if (collaborationType === "professors") {
        endpoint += "/professor-collaboration";
        data = {
          ...projectData,
          professorId: id,
        };
      } else if (collaborationType === "students") {
        endpoint += "/student-opportunity";
        data = {
          ...projectData,
          professorId: id,
          category: studentOpportunityType.toUpperCase(),
        };
      } else if (collaborationType === "industries") {
        endpoint += "/industry-collaboration";
        data = {
          ...projectData,
          professorId: id,
        };
      } else {
        throw new Error("Invalid collaboration type selected.");
      }

      const response = await axios.post(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update professor state with the new project
      setProfessor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: [...prev.projects, response.data],
        };
      });

      // Update categorizedProjects based on the new project's category
      setCategorizedProjects((prev) => {
        const newCategories = { ...prev };
        const category = response.data.category.toLowerCase();

        // Map the API category to our state category
        const categoryMap: { [key: string]: keyof ProjectCategories } = {
          industry_collaboration: "industryCollaboration",
          professor_collaboration: "professorCollaboration",
          internship: "internship",
          rnd_project: "rndProject",
          phd_position: "phdPosition",
        };

        const stateCategory = categoryMap[category];
        if (stateCategory) {
          newCategories[stateCategory] = [
            ...newCategories[stateCategory],
            response.data,
          ];
        }

        return newCategories;
      });

      // Show success toast
      toast({
        title: "Project Created Successfully!",
        description:
          "Your project has been posted and is now visible on project opennings page.",
        variant: "default",
        duration: 5000,
        className: "bg-[#eb5e17] text-white",
      });

      // Reset form and close dialog
      setIsProjectDialogOpen(false);
      setCollaborationType("");
      setStudentOpportunityType("");
      setCategory("");
      setSubcategory("");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error Creating Project",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsCreatingProject(false);
    }
  };

  // handler for deleting the project
  const handleDeleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = `${API_URL}/project/${projectId}/delete`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update professor state by removing the deleted project
      setProfessor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: prev.projects.filter((project) => project.id !== projectId),
        };
      });

      // Update categorizedProjects state
      setCategorizedProjects((prev) => {
        const newCategories = { ...prev };
        Object.keys(newCategories).forEach((key) => {
          newCategories[key as keyof ProjectCategories] = newCategories[
            key as keyof ProjectCategories
          ].filter((project) => project.id !== projectId);
        });
        return newCategories;
      });

      // Clear the project from appliedApplicantsMap if it exists
      setAppliedApplicantsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[projectId];
        return newMap;
      });

      // Close the modal
      setIsModalOpen(false);
      setProjectIDToDelete(null);

      // Show success toast
      toast({
        title: "Project Deleted Successfully",
        description: "The project has been permanently removed.",
        variant: "default",
        duration: 5000,
        className: "bg-[#eb5e17] text-white",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error Deleting Project",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to delete this project?
          </h3>
          <div className="flex justify-evenly">
            <Button
              onClick={() => handleDeleteProject(projectIDToDelete as string)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Yes
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              No
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Form submission handler for creating projects
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // console.log("formdata", formData)
    const projectData: any = {
      topic: formData.get("topic"),
      content: formData.get("content"),
      timeline: formData.get("timeline"),
      tags: formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((tag) => tag.trim()),
      deadline: formData.get("deadline"),
      duration: formData.get("duration"),
      isFunded: formData.get("isFunded") === "true",
      techDescription: formData.get("techDescription"),
    };
    // console.log(category);
    // console.log(subcategory);
    projectData.cat = category;
    projectData.subcategory = subcategory;
    // Add additional fields based on collaboration type
    if (collaborationType === "students") {
      projectData.eligibility = formData.get("eligibility");
      projectData.fundDetails = formData.get("fundDetails");
      projectData.desirable = formData.get("desirable");
    } else if (collaborationType === "industries") {
      projectData.requirements = formData.get("requirements");
    }
    handleCreateProject(projectData);
  };

  // Loading state handler
  if (isLoading) {
    return (
      <div className="text-center flex items-center justify-center h-screen bg-white">
        <div className="loader text-[#eb5e17] font-caveat text-2xl">
          Loading...
        </div>
        <div className="text-[#472014] ml-2">please wait</div>
      </div>
    );
  }

  // Error state handler
  if (error) {
    return <div>{error}</div>;
  }

  // Handler for when professor data is not found
  if (!professor) {
    return <div>Professor not found</div>;
  }

  // Render functions for different tabs
  const renderNotificationsTab = () => (
    <TabsContent value="notifications">
      {id == localStorage.getItem("userId") && (
        <Card className="border-2 border-[#eb5e17]/20 bg-white shadow-lg rounded-xl">
          <CardHeader className="border-b border-[#eb5e17]/10 bg-[#eb5e17]/5">
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Bell className="mr-3 h-6 w-6 text-[#eb5e17]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#eb5e17]/30 hover:bg-[#eb5e17]/5 hover:shadow-md cursor-pointer"
                  >
                    <a href={notification.redirectionLink}>
                      <div className="flex-grow space-y-2">
                        <p className="text-[#472014] text-md font-light  leading-snug line-clamp-2">
                          {notification.content}
                        </p>
                        <p
                          className={`text-sm ${
                            notification.isRead
                              ? "text-gray-500"
                              : "text-[#eb5e17] font-semibold"
                          }`}
                        >
                          {new Date(notification.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="sm"
                          className="ml-4 bg-[#eb5e17] text-white transition-colors hover:bg-[#472014]"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-gray-500 italic">
                No notifications yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );

  // Render function for enrolled projects tab
  const renderEnrolledProjectsTab = () => (
    <TabsContent value="enrolled-projects">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <EnrolledProjectsTabs
            userId={Array.isArray(id) ? id[0] : id}
            role="professor"
          />
        </div>
      </section>
    </TabsContent>
  );

  // Render function for projects tab
  const renderProjectsTab = () => (
    <TabsContent value="projects">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Dialog
          open={isProjectDialogOpen}
          onOpenChange={setIsProjectDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#eb5e17] hover:bg-[#472014] text-white">
              <Plus className="mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="border-[#eb5e17] bg-white">
            <DialogHeader className="bg-[#eb5e17] text-black p-4 rounded-t-lg">
              <DialogTitle>Create a New Project</DialogTitle>
            </DialogHeader>
            <div className="h-[500px] overflow-y-auto border rounded-lg p-4 text-black">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Collaboration Type</Label>
                  <Select
                    name="collaborationType"
                    value={collaborationType}
                    onValueChange={(value) => {
                      setCollaborationType(value);
                      setStudentOpportunityType("");
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Collaboration Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="professors">Professors</SelectItem>
                      <SelectItem value="industries">Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {collaborationType === "professors" && (
                  <>
                    <div>
                      <Label>Category</Label>
                      <Select
                        name="cat"
                        value={category}
                        onValueChange={(value: string) => {
                          setCategory(value);
                          setSubcategory(""); // Reset subcategory when category changes
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.keys(categories) as Array<
                              keyof typeof categories
                            >
                          ).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {category && (
                      <div>
                        <Label>Subcategory</Label>
                        <Select
                          name="subcategory"
                          value={subcategory}
                          onValueChange={setSubcategory}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories[
                              category as keyof typeof categories
                            ].map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                {collaborationType === "students" && (
                  <div>
                    <Label>Student Opportunity Type</Label>
                    <Select
                      name="studentOpportunityType"
                      value={studentOpportunityType}
                      onValueChange={setStudentOpportunityType}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Opportunity Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="PHD_POSITION">
                          PhD Position
                        </SelectItem>
                        <SelectItem value="RND_PROJECT">
                          Research Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="project-topic">Topic</Label>
                  <Input
                    id="project-topic"
                    name="topic"
                    placeholder="Enter project topic"
                    className="bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="project-tech-description">
                    Technical Description
                  </Label>
                  <Input
                    id="project-tech-description"
                    name="techDescription"
                    placeholder="Enter technology description"
                    className="bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="project-tags">Tags (comma separated)</Label>
                  <Input
                    id="project-tags"
                    name="tags"
                    placeholder="e.g., AI, Machine Learning, Data Science"
                    className="bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Project Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="Enter project duration"
                    className="bg-white text-black"
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">
                    Application Deadline
                    <br />
                    (Project will be deleted 10 days after the deadline)
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    required
                    className="bg-white text-black"
                  />
                </div>

                {collaborationType === "students" && (
                  <>
                    <div>
                      <Label htmlFor="project-eligibility">Eligibility</Label>
                      <Input
                        id="project-eligibility"
                        name="eligibility"
                        placeholder="Enter eligibility criteria"
                        className="bg-white text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-desirable">
                        Desirable Skills
                      </Label>
                      <Input
                        id="project-desirable"
                        name="desirable"
                        placeholder="Enter desirable skills"
                        className="bg-white text-black"
                      />
                    </div>
                  </>
                )}

                {collaborationType === "industry" && (
                  <div>
                    <Label htmlFor="project-requirements">
                      What I am looking for ?
                    </Label>
                    <Textarea
                      id="project-requirements"
                      name="requirements"
                      placeholder="Enter project requirements"
                    />
                  </div>
                )}
                <div>
                  <Label>Is Funded</Label>
                  <Select name="isFunded" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isCreatingProject}
                  className="bg-[#eb5e17] hover:bg-[#472014] text-white w-full"
                >
                  {isCreatingProject ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Industry Collaboration Projects */}
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Building className="mr-2 text-[#eb5e17]" />
              Industry Collaboration Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectList
              projects={categorizedProjects.industryCollaboration}
              appliedApplicantsMap={appliedApplicantsMap}
              isLoadingApplicants={isLoadingApplicants}
              onToggleApplicants={toggleApplicants}
              onDeleteProject={(projectId) => {
                setProjectIDToDelete(projectId);
                setIsModalOpen(true);
              }}
              onHandleAssignApplicant={(
                projectId,
                applicantId,
                applicantType
              ) => handleAssignApplicant(projectId, applicantId, applicantType)}
              onHandleRejectApplicant={(
                projectId,
                applicantId,
                applicantType
              ) => handleRejectApplicant(projectId, applicantId, applicantType)}
              onHandleSetInReview={(projectId, applicantId, applicantType) =>
                handleSetInReview(projectId, applicantId, applicantType)
              }
              onHandleCompleteProject={handleCompleteProject}
            />
          </CardContent>
        </Card>

        {/* Professor Collaboration Projects */}
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Briefcase className="mr-2 text-[#eb5e17]" />
              Professor Collaboration Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectList
              projects={categorizedProjects.professorCollaboration}
              appliedApplicantsMap={appliedApplicantsMap}
              isLoadingApplicants={isLoadingApplicants}
              onToggleApplicants={toggleApplicants}
              onDeleteProject={(projectId) => {
                setProjectIDToDelete(projectId);
                setIsModalOpen(true);
              }}
              onHandleAssignApplicant={handleAssignApplicant}
              onHandleRejectApplicant={handleRejectApplicant}
              onHandleSetInReview={handleSetInReview}
              onHandleCompleteProject={handleCompleteProject}
            />
          </CardContent>
        </Card>

        {/* Student Projects */}
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <GraduationCap className="mr-2 text-[#eb5e17]" />
              Student Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Internships */}
            <h3 className="text-xl font-semibold mb-2 text-[#472014]">
              Internships
            </h3>
            <ProjectList
              projects={categorizedProjects.internship}
              appliedApplicantsMap={appliedApplicantsMap}
              isLoadingApplicants={isLoadingApplicants}
              onToggleApplicants={toggleApplicants}
              onDeleteProject={(projectId) => {
                setProjectIDToDelete(projectId);
                setIsModalOpen(true);
              }}
              onHandleAssignApplicant={handleAssignApplicant}
              onHandleRejectApplicant={handleRejectApplicant}
              onHandleSetInReview={handleSetInReview}
              onHandleCompleteProject={handleCompleteProject}
            />

            {/* Research Projects */}
            <h3 className="text-xl font-semibold mb-2 mt-6 text-[#472014]">
              Research Projects
            </h3>
            <ProjectList
              projects={categorizedProjects.rndProject}
              appliedApplicantsMap={appliedApplicantsMap}
              isLoadingApplicants={isLoadingApplicants}
              onToggleApplicants={toggleApplicants}
              onDeleteProject={(projectId) => {
                setProjectIDToDelete(projectId);
                setIsModalOpen(true);
              }}
              onHandleAssignApplicant={handleAssignApplicant}
              onHandleRejectApplicant={handleRejectApplicant}
              onHandleSetInReview={handleSetInReview}
              onHandleCompleteProject={handleCompleteProject}
            />

            {/* PhD Positions */}
            <h3 className="text-xl font-semibold mb-2 mt-6 text-[#472014]">
              PhD Positions
            </h3>
            <ProjectList
              projects={categorizedProjects.phdPosition}
              appliedApplicantsMap={appliedApplicantsMap}
              isLoadingApplicants={isLoadingApplicants}
              onToggleApplicants={toggleApplicants}
              onDeleteProject={(projectId) => {
                setProjectIDToDelete(projectId);
                setIsModalOpen(true);
              }}
              onHandleAssignApplicant={handleAssignApplicant}
              onHandleRejectApplicant={handleRejectApplicant}
              onHandleSetInReview={handleSetInReview}
              onHandleCompleteProject={handleCompleteProject}
            />
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>
  );

  // Tab configuration
  const tabItems = [
    { id: "profile", label: "My Profile", icon: <GraduationCap /> },
    ...(isLoggedInUser
      ? [
          { id: "projects", label: "My Projects", icon: <Briefcase /> },
          { id: "webinars", label: "My Webinars", icon: <Video /> },
          { id: "blogs", label: "My Research Corner", icon: <BookOpen /> },
          { id: "notifications", label: "Notifications", icon: <Bell /> },
          {
            id: "enrolled-projects",
            label: "Enrolled Projects",
            icon: <BookOpen />,
          },
        ]
      : []),
  ];

  // Main component render
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      {/* Navigation Bar */}
      <NavbarWithBg />

      {/* Global Chat Box (only for logged-in users) */}
      {isLoggedInUser && <GlobalChatBox isChatOpen={isChatOpen} />}

      <main className="flex-grow">
        {/* Hero Section with Professor Info */}
        <motion.section
          className="relative text-white py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image */}
          <Image
            src={PROFESSORPAGE}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage
                    src={professor.photoUrl}
                    alt={professor.fullName}
                  />
                  <AvatarFallback>
                    {professor.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-black">
                    {professor.fullName}
                  </h1>
                  <p className="text-xl text-black">{professor.title}</p>
                  <p className="text-xl text-black">{professor.bio}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                {professor.website && (
                  <a
                    className="btn btn-outline flex items-center text-black"
                    href={professor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4 text-black" />
                    Website
                  </a>
                )}
                <a
                  className="btn btn-outline flex items-center text-black"
                  href={professor.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4 text-black" />
                  Google Scholar
                </a>
                {!isLoggedInUser && (
                  <Button
                    className="bg-white px-4 py-2 border-2 border-white"
                    onClick={handleContact}
                  >
                    Send Message
                  </Button>
                )}
                {isLoggedInUser && (
                  <Link href={"/edit-profile"}>
                    <Button className="bg-[#eb5e17] hover:bg-[#472014] text-white flex flex-end">
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main Content Section with Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="flex flex-wrap justify-center bg-white border-[#eb5e17] border-2 text-[#472014] p-2 h-44 lg:h-auto rounded-lg">
                {tabItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-[#eb5e17] data-[state=active]:text-white"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.id === "notifications" && unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-white text-[#472014]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold ">
                        <GraduationCap className="mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <strong>Degree:</strong> {professor.degree || "N/A"}
                        </li>
                        <li>
                          <strong>Designation:</strong> {professor.title}
                        </li>
                        <li>
                          <strong>Department:</strong> {professor.department}
                        </li>
                        <li>
                          <strong>University/Institute:</strong>{" "}
                          {professor.university}
                        </li>
                        <li>
                          <strong>Country:</strong> {professor.location}
                        </li>
                        <li>
                          <strong>Professor tags: </strong>
                          {professor.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-black"
                            >
                              {tag.category}
                              {tag.subcategory && ` - ${tag.subcategory}`}
                            </Badge>
                          ))}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-white text-[#472014]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <BookOpen className="mr-2" />
                        Research Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {professor.researchInterests &&
                      professor.researchInterests.length > 0 ? (
                        <ul className="space-y-6">
                          {professor.researchInterests.map((research) => (
                            <li key={research.id} className="space-y-3">
                              <div className="flex flex-col gap-3">
                                <Badge
                                  variant="outline"
                                  className="text-black w-fit"
                                >
                                  {research.title}
                                </Badge>
                                {research.imageUrl &&
                                  research.imageUrl.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                      {research.imageUrl.map((url, index) => (
                                        <Image
                                          key={`${research.id}-${index}`}
                                          src={url}
                                          alt={`${research.title} - Image ${
                                            index + 1
                                          }`}
                                          height={100}
                                          width={100}
                                          className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={() => openModal(url)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                {research.description && (
                                  <p className="text-sm text-gray-600">
                                    {research.description}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No research interests listed yet.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white text-[#472014]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold">
                        <Briefcase className="mr-2" />
                        Positions Held
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {professor.positions.length > 0 ? (
                        <ul className="space-y-2">
                          {professor.positions.map((position) => (
                            <li
                              key={position.id}
                              className="flex items-center space-x-2 overflow-x-auto"
                            >
                              <Badge
                                variant="outline"
                                className="w-[140px] h-8 flex items-center justify-center shrink-0 text-center text-xs font-normal text-black"
                              >
                                {position.startYear} -{" "}
                                {position.current
                                  ? "Current year"
                                  : position.endYear}
                              </Badge>
                              <span>
                                {position.title}, {position.institution}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No positions listed yet.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white text-[#472014]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold ">
                        <Award className="mr-2" />
                        Teaching Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {professor.achievements.length > 0 ? (
                        <ul className="space-y-2">
                          {professor.achievements.map((achievement) => (
                            <li
                              key={achievement.id}
                              className="flex items-center"
                            >
                              <div className="mr-2 w-2 h-2 bg-[#472014] rounded-full"></div>
                              {achievement.description}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No teaching interests listed yet.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Modal */}

                  {selectedImage && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                      onClick={closeModal}
                    >
                      <div className="relative max-w-4xl w-full aspect-video bg-white rounded-lg p-2">
                        <Image
                          src={selectedImage}
                          alt="NA"
                          fill
                          className="object-contain rounded"
                        />
                        <button
                          onClick={closeModal}
                          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
              {isLoggedInUser && (
                <>
                  <TabsContent value="blogs">
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-white text-[#472014] shadow-md">
                        <CardHeader className="border-b border-gray-100">
                          <CardTitle className="flex items-center text-2xl font-bold">
                            <BookOpen className="mr-2 h-6 w-6 text-[#eb5e17]" />
                            My Research Corner
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                          {professor?.blogs && professor.blogs.length > 0 ? (
                            <ul className="grid gap-6">
                              {professor.blogs.map((blog: any) => (
                                <motion.li
                                  key={blog.id}
                                  className="rounded-lg border border-gray-100 p-4 md:p-6 hover:shadow-lg transition-all duration-300"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                      <h3 className="text-lg md:text-xl font-semibold text-[#472014] line-clamp-2 hover:text-[#eb5e17] transition-colors">
                                        {blog.title}
                                      </h3>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(
                                          blog.createdAt
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </div>
                                      <p className="text-gray-600 line-clamp-3">
                                        {blog.content.length > 150
                                          ? `${blog.content.substring(
                                              0,
                                              150
                                            )}...`
                                          : blog.content}
                                      </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 items-start">
                                      <div className="flex flex-wrap gap-2">
                                        <Badge
                                          variant="secondary"
                                          className="bg-[#eb5e17]/10 text-[#eb5e17] hover:bg-[#eb5e17]/20"
                                        >
                                          <ThumbsUp className="h-3 w-3 mr-1" />{" "}
                                          {blog.likes}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="text-gray-600 hover:bg-gray-50"
                                        >
                                          <ThumbsDown className="h-3 w-3 mr-1" />{" "}
                                          {blog.dislikes}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="text-gray-600 hover:bg-gray-50"
                                        >
                                          <MessageCircle className="h-3 w-3 mr-1" />{" "}
                                          {blog.comments.length}
                                        </Badge>
                                      </div>
                                      <Link
                                        href={`/blogs/${blog.id}`}
                                        className="w-full sm:w-auto md:w-full lg:w-auto"
                                      >
                                        <Button
                                          variant="outline"
                                          className="w-full bg-[#eb5e17] hover:bg-[#472014] text-white transition-colors duration-300"
                                        >
                                          <Eye className="h-4 w-4 mr-2" /> View
                                          Blog
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-12">
                              <BookX className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                              <p className="text-gray-500 text-lg">
                                No blogs posted yet.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* webinar --section */}

                  <TabsContent value="webinars">
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="text-[#472014] bg-white">
                        <CardHeader>
                          <CardTitle className="flex items-center text-2xl font-bold ">
                            <Video className="mr-2" />
                            My Webinars (Conferences/Workshops)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex justify-end">
                              <Dialog
                                open={isWebinarDialogOpen}
                                onOpenChange={setIsWebinarDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button className="bg-[#eb5e17] hover:bg-[#472014] text-white">
                                    Request Webinar
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-black">
                                      Request a New Webinar
                                      (Conferences/Workshops)
                                    </DialogTitle>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const formData = new FormData(
                                        e.currentTarget
                                      );
                                      const webinarData = {
                                        professorId: id,
                                        title: formData.get("title") as string,
                                        topic: formData.get("topic") as string,
                                        place: formData.get("place") as string,
                                        date: formData.get("date") as string,
                                        maxAttendees: parseInt(
                                          formData.get("maxAttendees") as string
                                        ),
                                        duration: parseInt(
                                          formData.get("duration") as string
                                        ),
                                        isOnline:
                                          formData.get("place") === "online",
                                        meetingLink: formData.get(
                                          "meetingLink"
                                        ) as string,
                                        address: formData.get(
                                          "address"
                                        ) as string,
                                      };

                                      const webinarImage = formData.get(
                                        "webinarImage"
                                      ) as File;
                                      const webinarDocument = formData.get(
                                        "webinarDocument"
                                      ) as File;
                                      handleCreateWebinar(
                                        webinarData,
                                        webinarImage,
                                        webinarDocument
                                      );
                                    }}
                                    className="space-y-4 text-black"
                                  >
                                    <div>
                                      <Label htmlFor="webinar-title">
                                        Webinar Title (Conferences/Workshops)
                                      </Label>
                                      <Input
                                        id="webinar-title"
                                        name="title"
                                        placeholder="Enter webinar title"
                                        required
                                        className="text-black bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-topic">
                                        Abstract
                                      </Label>
                                      <Input
                                        id="webinar-topic"
                                        name="topic"
                                        placeholder="Enter webinar abstract"
                                        required
                                        className="text-black bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-place">
                                        Place
                                      </Label>
                                      <Select
                                        name="place"
                                        required
                                        onValueChange={(value) =>
                                          setPlace(value)
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a place" />
                                        </SelectTrigger>
                                        <SelectContent className="text-black bg-white">
                                          <SelectItem value="online">
                                            Online
                                          </SelectItem>
                                          <SelectItem value="in-person">
                                            In-person
                                          </SelectItem>
                                          <SelectItem value="hybrid">
                                            Hybrid
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Show address field for in-person or hybrid */}
                                    {(place === "in-person" ||
                                      place === "hybrid") && (
                                      <div>
                                        <Label htmlFor="webinar-address">
                                          Address
                                        </Label>
                                        <Input
                                          id="webinar-address"
                                          name="address"
                                          type="text"
                                          placeholder="123 Event St, City, State, Zip"
                                          className="text-black bg-white"
                                        />
                                      </div>
                                    )}

                                    {/* Show meeting link field for online or hybrid */}
                                    {(place === "online" ||
                                      place === "hybrid") && (
                                      <div>
                                        <Label htmlFor="webinar-meeting-link">
                                          Meeting Link
                                        </Label>
                                        <Input
                                          id="webinar-meeting-link"
                                          name="meetingLink"
                                          type="url"
                                          placeholder="https://example.com/meeting"
                                          className="text-black bg-white"
                                        />
                                      </div>
                                    )}

                                    <div>
                                      <Label htmlFor="webinar-date">Date</Label>
                                      <Input
                                        id="webinar-date"
                                        name="date"
                                        type="datetime-local"
                                        required
                                        className="text-black bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-max-attendees">
                                        Max Attendees
                                      </Label>
                                      <Input
                                        id="webinar-max-attendees"
                                        name="maxAttendees"
                                        type="number"
                                        min="1"
                                        required
                                        className="text-black bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-duration">
                                        Duration (minutes)
                                      </Label>
                                      <Input
                                        id="webinar-duration"
                                        name="duration"
                                        type="number"
                                        min="1"
                                        required
                                        className="text-black bg-white"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="webinar-image"
                                        className="mb-2 text-gray-700 font-medium"
                                      >
                                        Webinar Image
                                      </Label>
                                      <Input
                                        id="webinar-image"
                                        name="webinarImage"
                                        type="file"
                                        accept="image/*"
                                        className="text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 p-2"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor="webinar-document"
                                        className="mb-2 text-gray-700 font-medium"
                                      >
                                        Webinar Document (PDF/DOC)
                                      </Label>
                                      <Input
                                        id="webinar-document"
                                        name="webinarDocument"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 p-2"
                                      />
                                      <p className="text-sm text-gray-500 mt-1">
                                        Upload a detailed document about the
                                        webinar (max 10MB)
                                      </p>
                                    </div>

                                    {/* add spinner when I press submit */}
                                    {webinarCreationLoading ? (
                                      <div className="flex justify-center items-center py-4">
                                        <ReloadIcon className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">
                                          Creating a Webinar...
                                        </span>
                                      </div>
                                    ) : (
                                      <Button type="submit">
                                        Submit for Approval
                                      </Button>
                                    )}
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </div>

                            {[
                              "PENDING",
                              "APPROVED",
                              "REJECTED",
                              "COMPLETED",
                              "CANCELLED",
                            ].map((status) => (
                              <div key={status}>
                                <h3 className="text-xl font-semibold mb-2">
                                  {status === "PENDING"
                                    ? "Pending Approval"
                                    : `${
                                        status.charAt(0) +
                                        status.slice(1).toLowerCase()
                                      } Webinars`}
                                </h3>
                                <ul className="space-y-4">
                                  {webinars
                                    .filter(
                                      (webinar) => webinar.status === status
                                    )
                                    .map((webinar) => (
                                      <li
                                        key={webinar.id}
                                        className="flex items-center justify-between border-b pb-4"
                                      >
                                        <div className="flex items-center space-x-4">
                                          {webinar.webinarImage && (
                                            <Image
                                              src={webinar.webinarImage}
                                              alt={webinar.title}
                                              width={64}
                                              height={64}
                                              className="w-16 h-16 object-cover rounded"
                                            />
                                          )}
                                          <div>
                                            <span className="font-semibold">
                                              {webinar.title}
                                            </span>
                                            <p className="text-sm text-gray-500">
                                              {webinar.topic}
                                            </p>
                                            {webinar.webinarDocument && (
                                              <Link
                                                href={webinar.webinarDocument}
                                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                target="_blank"
                                              >
                                                <BookOpen className="w-4 h-4" />
                                                View Document
                                              </Link>
                                            )}
                                          </div>

                                          <div>
                                            <span className="font-semibold">
                                              {webinar.title}
                                            </span>
                                            <p className="text-sm text-gray-500">
                                              {webinar.topic}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Badge
                                            variant={
                                              status === "COMPLETED"
                                                ? "secondary"
                                                : status === "PENDING"
                                                ? "outline"
                                                : "default"
                                            }
                                            className="bg-[#eb5e17] hover:bg-[#472014] text-white font-caveat"
                                          >
                                            {new Date(
                                              webinar.date
                                            ).toLocaleDateString()}
                                          </Badge>
                                          {status === "APPROVED" && (
                                            <>
                                              <Button
                                                size="sm"
                                                onClick={() =>
                                                  handleUpdateWebinarStatus(
                                                    webinar.id,
                                                    "COMPLETED"
                                                  )
                                                }
                                                className="bg-[#eb5e17] hover:bg-[#472014] text-white"
                                              >
                                                Mark Completed
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                  handleUpdateWebinarStatus(
                                                    webinar.id,
                                                    "CANCELLED"
                                                  )
                                                }
                                              >
                                                Cancel
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  {renderProjectsTab()}
                  {renderNotificationsTab()}
                  {renderEnrolledProjectsTab()}
                  {isModalOpen && ConfirmationModal()}
                </>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default ProfessorProfilePage;
