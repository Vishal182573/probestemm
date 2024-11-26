/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
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
import { useParams } from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { PROFESSORPAGE } from "../../../../public";

interface AppliedApplicant {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  images: string[];
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
    title: string;
    description: string;
    imageUrl: string;
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
  id: string;
  topic: string;
  content: string;
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
  duration?: {
    startDate: string;
    endDate: string;
  };
}

interface AppliedStudent {
  projectId: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
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
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  webinarImage?: string;
  webinarDocument?: string;
}

interface SelectedImage {
  url: string;
  title: string;
}

const ProfessorProfilePage: React.FC = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isWebinarDialogOpen, setIsWebinarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [appliedApplicantsMap, setAppliedApplicantsMap] = useState<{
    [projectId: string]: AppliedApplicant[];
  }>({});
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<{
    [projectId: string]: boolean;
  }>({});

  const openModal = (imageUrl: string, title: string) => {
    setSelectedImage({ url: imageUrl, title });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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

      setAppliedApplicantsMap((prevMap) => ({
        ...prevMap,
        [projectId]: allApplications,
      }));
    } catch (error) {
      console.error("Error fetching applied applicants:", error);
      setError("Failed to fetch applied applicants. Please try again.");
    } finally {
      setIsLoadingApplicants((prev) => ({ ...prev, [projectId]: false }));
    }
  };

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

      console.log("Sending webinar data:", webinarData);
      console.log("Sending webinar image:", webinarImage);
      console.log("Sending webinar document:", webinarDocument);

      const response = await axios.post(`${API_URL}/webinars`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);

      setWebinars((prevWebinars) => [...prevWebinars, response.data]);
      setIsWebinarDialogOpen(false);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!professor) {
    return <div>Professor not found</div>;
  }

  const renderNotificationsTab = () => (
    <TabsContent value="notifications">
      {id == localStorage.getItem("userId") && (
        <Card className="border-2 border-[#eb5e17]/20 bg-white shadow-md">
          <CardHeader className="border-b border-[#eb5e17]/10">
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Bell className="mr-3 h-6 w-6 text-[#eb5e17]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {notifications.length > 0 ? (
              <ul className="space-y-6">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[#eb5e17]/20 hover:bg-gray-50"
                  >
                    <div className="space-y-2">
                      <p
                        className={`${
                          notification.isRead
                            ? "text-gray-600"
                            : "font-semibold"
                        }`}
                      >
                        <p className="text-[#472014] text-xl font-bold leading-snug line-clamp-2">
                          {notification.content}
                        </p>
                      </p>
                      <p className="text-sm text-gray-500">
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
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-gray-500">
                No notifications yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );

  const categorizedProjects = {
    industryCollaboration: [] as Project[],
    professorCollaboration: [] as Project[],
    internship: [] as Project[],
    rndProject: [] as Project[],
    phdPosition: [] as Project[],
  };

  professor.projects.forEach((project) => {
    switch (project.category) {
      case "INDUSTRY_COLLABORATION":
        categorizedProjects.industryCollaboration.push(project);
        break;
      case "PROFESSOR_COLLABORATION":
        categorizedProjects.professorCollaboration.push(project);
        break;
      case "INTERNSHIP":
        categorizedProjects.internship.push(project);
        break;
      case "RND_PROJECT":
        categorizedProjects.rndProject.push(project);
        break;
      case "PHD_POSITION":
        categorizedProjects.phdPosition.push(project);
        break;
      default:
        break;
    }
  });

  const renderProjectsTab = () => (
    <TabsContent value="projects">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Industry Collaboration Projects */}
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Building className="mr-2 text-[#eb5e17]" />
              Industry Collaboration Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categorizedProjects.industryCollaboration.length > 0 ? (
              <ul className="space-y-4">
                {categorizedProjects.industryCollaboration.map((project) => (
                  <li
                    key={project.id}
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-[#472014]">
                        {project.topic}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-[#686256] text-white"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#686256] mb-2">
                      {project.content.substring(0, 100)}...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => toggleApplicants(project.id)}
                    >
                      {appliedApplicantsMap[project.id] ? "Hide" : "View"}{" "}
                      Applicants
                    </Button>
                    {appliedApplicantsMap[project.id] && (
                      <div className="mt-4">
                        <h5 className="text-md font-semibold mb-2">
                          Applicants:
                        </h5>
                        {isLoadingApplicants[project.id] ? (
                          <Loader2 className="h-6 w-6 animate-spin text-[#eb5e17]" />
                        ) : appliedApplicantsMap[project.id].length > 0 ? (
                          <ul className="space-y-2">
                            {appliedApplicantsMap[project.id].map(
                              (applicant) => (
                                <li
                                  key={applicant.id}
                                  className="flex items-center space-x-4"
                                >
                                  <div>
                                    <p className="font-semibold  text-gray-600">
                                      {applicant.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.phoneNumber}
                                    </p>
                                    <Image
                                      src={applicant.images[0]}
                                      alt="Resume"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAssignApplicant(
                                        project.id,
                                        applicant.id,
                                        "business"
                                      )
                                    }
                                    className="bg-[#eb5e17] text-white"
                                  >
                                    Assign
                                  </Button>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>No applicants yet.</p>
                        )}
                      </div>
                    )}
                    {project.status === "ONGOING" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteProject(project.id)}
                        className="mt-2 bg-[#eb5e17] text-white"
                      >
                        Complete Project
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">
                No projects available.
              </p>
            )}
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
            {categorizedProjects.professorCollaboration.length > 0 ? (
              <ul className="space-y-4">
                {categorizedProjects.professorCollaboration.map((project) => (
                  <li
                    key={project.id}
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-[#472014]">
                        {project.topic}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-[#686256] text-white"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#686256] mb-2">
                      {project.content.substring(0, 100)}...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => toggleApplicants(project.id)}
                    >
                      {appliedApplicantsMap[project.id] ? "Hide" : "View"}{" "}
                      Applicants
                    </Button>
                    {appliedApplicantsMap[project.id] && (
                      <div className="mt-4">
                        <h5 className="text-md font-semibold mb-2">
                          Applicants:
                        </h5>
                        {isLoadingApplicants[project.id] ? (
                          <Loader2 className="h-6 w-6 animate-spin text-[#eb5e17]" />
                        ) : appliedApplicantsMap[project.id].length > 0 ? (
                          <ul className="space-y-2">
                            {appliedApplicantsMap[project.id].map(
                              (applicant) => (
                                <li
                                  key={applicant.id}
                                  className="flex items-center space-x-4"
                                >
                                  <div>
                                    <p className="font-semibold  text-gray-600">
                                      {applicant.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.phoneNumber}
                                    </p>
                                    <Image
                                      src={applicant.images[0]}
                                      alt="Resume"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAssignApplicant(
                                        project.id,
                                        applicant.id,
                                        "professor"
                                      )
                                    }
                                    className="bg-[#eb5e17] text-white"
                                  >
                                    Assign
                                  </Button>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>No applicants yet.</p>
                        )}
                      </div>
                    )}
                    {project.status === "ONGOING" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteProject(project.id)}
                        className="mt-2 bg-[#eb5e17] text-white"
                      >
                        Complete Project
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">
                No projects available.
              </p>
            )}
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
            {/* Internship Projects */}
            <h3 className="text-xl font-semibold mb-2 text-[#472014]">
              Internships
            </h3>
            {categorizedProjects.internship.length > 0 ? (
              <ul className="space-y-4">
                {categorizedProjects.internship.map((project) => (
                  <li
                    key={project.id}
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-[#472014]">
                        {project.topic}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-[#686256] text-white"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#686256] mb-2">
                      {project.content.substring(0, 100)}...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => toggleApplicants(project.id)}
                    >
                      {appliedApplicantsMap[project.id] ? "Hide" : "View"}{" "}
                      Applicants
                    </Button>
                    {appliedApplicantsMap[project.id] && (
                      <div className="mt-4">
                        <h5 className="text-md font-semibold mb-2">
                          Applicants:
                        </h5>
                        {isLoadingApplicants[project.id] ? (
                          <Loader2 className="h-6 w-6 animate-spin text-[#eb5e17]" />
                        ) : appliedApplicantsMap[project.id].length > 0 ? (
                          <ul className="space-y-2">
                            {appliedApplicantsMap[project.id].map(
                              (applicant) => (
                                <li
                                  key={applicant.id}
                                  className="flex items-center space-x-4"
                                >
                                  <div>
                                    <p className="font-semibold  text-gray-600">
                                      {applicant.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.phoneNumber}
                                    </p>
                                    <Image
                                      src={applicant.images[0]}
                                      alt="Resume"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAssignApplicant(
                                        project.id,
                                        applicant.id,
                                        "student"
                                      )
                                    }
                                    className="bg-[#eb5e17] text-white"
                                  >
                                    Assign
                                  </Button>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p>No applicants yet.</p>
                        )}
                      </div>
                    )}
                    {project.status === "ONGOING" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteProject(project.id)}
                        className="mt-2 bg-[#eb5e17] text-white"
                      >
                        Complete Project
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">
                No internships available.
              </p>
            )}

            {/* R&D Projects */}
            <h3 className="text-xl font-semibold mb-2 text-[#472014]">
              Research Projects
            </h3>
            {categorizedProjects.rndProject.length > 0 ? (
              <ul className="space-y-4">
                {categorizedProjects.rndProject.map((project) => (
                  <li
                    key={project.id}
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    {/* Similar content as above */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">
                No research projects available.
              </p>
            )}

            {/* PhD Positions */}
            <h3 className="text-xl font-semibold mb-2 text-[#472014]">
              PhD Positions
            </h3>
            {categorizedProjects.phdPosition.length > 0 ? (
              <ul className="space-y-4">
                {categorizedProjects.phdPosition.map((project) => (
                  <li
                    key={project.id}
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    {/* Similar content as above */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">
                No PhD positions available.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>
  );

  const tabItems = [
    { id: "profile", label: "My Profile", icon: <GraduationCap /> },
    ...(isLoggedInUser
      ? [
          { id: "projects", label: "My Projects", icon: <Briefcase /> },
          { id: "webinars", label: "My Webinars", icon: <Video /> },
          { id: "blogs", label: "My Blogs", icon: <BookOpen /> },
          { id: "notifications", label: "Notifications", icon: <Bell /> },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      <NavbarWithBg />

      <main className="flex-grow">
        <motion.section
          className="relative text-white py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={PROFESSORPAGE}
              alt="Background"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

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
                        Research Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {professor.researchInterests &&
                      professor.researchInterests.length > 0 ? (
                        <ul className="space-y-4">
                          {professor.researchInterests.map((research) => (
                            <li key={research.title} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-black">
                                  {research.title}
                                </Badge>
                                {research.imageUrl && (
                                  <Image
                                    src={research.imageUrl}
                                    alt={research.title}
                                    height={100}
                                    width={100}
                                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() =>
                                      openModal(
                                        research.imageUrl,
                                        research.title
                                      )
                                    }
                                  />
                                )}
                              </div>
                              {research.description && (
                                <p className="text-sm text-gray-600 ml-2">
                                  {research.description}
                                </p>
                              )}
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
                            <li key={position.id} className="flex items-center">
                              <Badge
                                variant="outline"
                                className="mr-2 text-black"
                              >
                                {position.startYear} -{" "}
                                {position.endYear || "Present"}
                              </Badge>
                              {position.title}, {position.institution}
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
                        Achievements
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
                              <Badge
                                variant="outline"
                                className="mr-2 text-black"
                              >
                                {achievement.year}
                              </Badge>
                              {achievement.description}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No achievements listed yet.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Modal */}

                  {selectedImage && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                      onClick={closeModal}
                    >
                      <div
                        className="relative max-w-4xl w-full bg-white rounded-lg p-2"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <button
                          onClick={closeModal}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                        <div className="mt-8 mb-4 text-center">
                          <h3 className="text-lg font-semibold text-[#472014]">
                            {selectedImage.title}
                          </h3>
                        </div>
                        <div className="flex justify-center">
                          <Image
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="max-h-[80vh] w-auto object-contain"
                          />
                        </div>
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
                            My Blogs
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
                            My Webinars
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
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Request a New Webinar
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
                                    className="space-y-4"
                                  >
                                    <div>
                                      <Label htmlFor="webinar-title">
                                        Webinar Title
                                      </Label>
                                      <Input
                                        id="webinar-title"
                                        name="title"
                                        placeholder="Enter webinar title"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-topic">
                                        Topic
                                      </Label>
                                      <Input
                                        id="webinar-topic"
                                        name="topic"
                                        placeholder="Enter webinar topic"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-place">
                                        Place
                                      </Label>
                                      <Select name="place" required>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a place" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    <div>
                                      <Label htmlFor="webinar-date">Date</Label>
                                      <Input
                                        id="webinar-date"
                                        name="date"
                                        type="datetime-local"
                                        required
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
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-meeting-link">
                                        Meeting Link (if online)
                                      </Label>
                                      <Input
                                        id="webinar-meeting-link"
                                        name="meetingLink"
                                        type="url"
                                        placeholder="https://example.com/meeting"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-image">
                                        Webinar Image
                                      </Label>
                                      <Input
                                        id="webinar-image"
                                        name="webinarImage"
                                        type="file"
                                        accept="image/*"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="webinar-document">
                                        Webinar Document (PDF/DOC)
                                      </Label>
                                      <Input
                                        id="webinar-document"
                                        name="webinarDocument"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                      />
                                      <p className="text-sm text-gray-500">
                                        Upload a detailed document about the
                                        webinar (max 10MB)
                                      </p>
                                    </div>
                                    <Button type="submit">
                                      Submit for Approval
                                    </Button>
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
                </>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessorProfilePage;
