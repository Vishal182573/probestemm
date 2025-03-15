/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Globe,
  Bell,
  FileText,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Link from "next/link";
import Image from "next/image";
import { PROFESSORPAGE } from "../../../../public";
import CreateProjectForm from "@/components/shared/professorprojectCreationForm";
import EnrolledProjectsTabs from "@/components/shared/EnrolledProjectsTab";
import GlobalChatBox from "@/components/shared/GlobalChatBox";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from 'next/navigation';

// Type definitions for notifications received by the business
type Notification = {
  id: string;
  type: "PROJECT_APPLICATION" | "PROJECT_ACCEPTED" | "PROJECT_COMPLETED";
  content: string;
  createdAt: string;
  isRead: boolean;
  businessId: string;
  projectId?: string;
  redirectionLink?:string;
};

// Interface defining the structure of a business profile
interface Business {
  id: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  location: string;
  industry: string;
  description: string;
  website?: string;
  profileImageUrl?: string;
}

// Interface for project application details from professors, students, or businesses
interface ApplicationDetails {
  id: string;
  description: string;
  resume: string;
  applicationType: "professor" | "student" | "business";
  applicantDetails: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string; 
    institution?: string;
    department?: string;
  };
  createdAt: string;
  status?: "PENDING" | "IN_REVIEW" | "ACCEPTED" | "REJECTED";
}

// Interface defining the structure of a project
interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: "RD_PROJECT" | "INTERNSHIP";
  category: string;
  business?: { id: string; companyName: string };
  professor?: { id: string; fullName: string };
  applications?: ApplicationDetails[];
  selectedApplicant: {
    id:string;
    type: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    images: string[]
  }
  createdAt: string | Date;
}

// Interface for professors who have applied to projects
interface AppliedProfessor {
  professorId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const BusinessProfilePage: React.FC = () => {
  // State management for business profile data
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for tracking applied professors and authentication status
  const [appliedProfessorsMap, setAppliedProfessorsMap] = useState<{[projectId: string]: AppliedProfessor[]}>({});
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const searchParams = useSearchParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // State for notifications and application tracking
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [applicationDetails, setApplicationDetails] = useState<{[projectId: string]: ApplicationDetails[]}>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectIDToDelete, setProjectIDToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Effect hook to fetch business data and related information on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");
        setIsLoggedInUser(id === loggedInUserId);

        const businessResponse = await axios.get(`${API_URL}/businesss/${id}`);
        setBusiness(businessResponse.data);

        // Fetch projects regardless of whether the user is logged in
        const projectsResponse = await axios.get(`${API_URL}/project/business/${id}/projects`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setProjects(projectsResponse.data);
        // console.log(projectsResponse.data);

        if (isLoggedInUser && token) {
          // Fetch notifications
          const notificationsResponse = await axios.get(
            `${API_URL}/notifications/business/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotifications(notificationsResponse.data);
          setUnreadCount(
            notificationsResponse.data.filter((n: Notification) => !n.isRead)
              .length
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [id, isLoggedInUser]);

  useEffect(() => {
    const openChat = searchParams.get('openChat');
    if (openChat === 'true') {
      setIsChatOpen(true);
    }
  }, [searchParams]);

  // Function to fetch application details for a specific project
  const fetchApplicationDetails = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/project/${projectId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Combine all types of applications with applicationType
      const allApplications = [
        ...response.data.professorApplications.map((app: any) => ({
          ...app,
          applicationType: "professor",
          status: app.status || "PENDING",
        })),
        ...response.data.studentApplications.map((app: any) => ({
          ...app,
          applicationType: "student",
          status: app.status || "PENDING",
        })),
        ...response.data.businessApplications.map((app: any) => ({
          ...app,
          applicationType: "business",
          status: app.status || "PENDING",
        })),
      ].map((app: any) => ({
        id: app.id,
        description: app.description,
        resume: app.resume || '',
        applicationType: app.applicationType,
        status: app.status,
        applicantDetails: {
          id: app.professorId || app.studentId || app.businessId || "",
          name: app.name,
          email: app.email,
          phoneNumber: app.phoneNumber,
          institution: app.university || app.companyName || "",
          department: app.department || app.industry || "",
        },
        createdAt: app.createdAt,
      }));

      setApplicationDetails((prev) => ({
        ...prev,
        [projectId]: allApplications,
      }));
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError("Failed to fetch application details. Please try again.");
    }
  };

  // Function to handle contact button click and create chat room
  const handleContact = async ()=>{
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to contact this business",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/chat/rooms`,
        {
          userOneId:id,
          userOneType:"business",
          userTwoId:localStorage.getItem("userId"),
          userTwoType:localStorage.getItem("role")
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response.status == 200){
        router.push(`/${localStorage.getItem("role")}-profile/${localStorage.getItem("userId")}?openChat=true`)
      }

    } catch (error:any) {
      console.error("Error marking notification as read:", error);
      setError(error.message);
    }
  }

  // Function to mark notifications as read
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

  // Function to handle project status changes (OPEN, ONGOING, CLOSED)
  const handleChangeProjectStatus = async (
    projectId: string,
    status: "OPEN" | "ONGOING" | "CLOSED",
    applicationId?: string,
    applicationType?: "professor" | "student" | "business"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      if (status === "ONGOING") {
        // Call assignParticipant route
        await axios.post(
          `${API_URL}/project/${projectId}/assign`,
          {
            applicationId,
            applicationType,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (status === "CLOSED") {
        // Call completeProject route
        await axios.post(
          `${API_URL}/project/${projectId}/complete`,
          {
            // Optionally, any completionNotes
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status } : project
        )
      );

      // Clear application details for this project after changing status
      setApplicationDetails((prev) => {
        const newAppDetails = { ...prev };
        delete newAppDetails[projectId];
        return newAppDetails;
      });
    } catch (error) {
      console.error("Error changing project status:", error);
      setError("Failed to change project status. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = `${API_URL}/project/${projectId}/delete`;

      // console.log("Deleting project with ID:", projectId);
  
      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
      setIsModalOpen(false);
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
        duration: 5000,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

// Function to handle rejecting an application
const handleRejectApplication = async (
  projectId: string,
  applicationId: string,
  applicationType: "professor" | "student" | "business"
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    await axios.post(
      `${API_URL}/project/${projectId}/reject`,
      {
        applicationId,
        applicationType,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update application status in the UI
    setApplicationDetails((prev) => {
      const updatedApplications = prev[projectId].map(app => 
        app.id === applicationId ? {...app, status: 'REJECTED'} : app
      );
      return {...prev, [projectId]: updatedApplications};
    });

    toast({
      title: "Application Rejected",
      description: "The application has been rejected successfully.",
      className: "bg-red-600 text-white",
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    toast({
      title: "Error",
      description: "Failed to reject application. Please try again.",
      variant: "destructive",
    });
  }
};

// Function to handle setting an application to in-review status
const handleSetInReview = async (
  projectId: string,
  applicationId: string,
  applicationType: "professor" | "student" | "business"
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    await axios.post(
      `${API_URL}/project/${projectId}/review`,
      {
        applicationId,
        applicationType,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update application status in the UI
    setApplicationDetails((prev) => {
      const updatedApplications = prev[projectId].map(app => 
        app.id === applicationId ? {...app, status: 'IN_REVIEW'} : app
      );
      return {...prev, [projectId]: updatedApplications};
    });

    toast({
      title: "Application Status Updated",
      description: "Application is now in review.",
      className: "bg-yellow-600 text-white",
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    toast({
      title: "Error",
      description: "Failed to update application status. Please try again.",
      variant: "destructive",
    });
  }
};
  
  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full">
          <h3 className="text-lg text-black font-semibold mb-4">Are you sure you want to delete this project?</h3>
          <div className="flex justify-evenly">
            <Button
              onClick={() => projectIDToDelete && handleDeleteProject(projectIDToDelete)} 
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

  // Loading and error state handlers
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

  if (!business) {
    return <div>Business not found</div>;
  }

  // Animation configuration for staggered children
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Component render functions
  const renderProjectApplications = (project: Project) => {
    const applications = applicationDetails[project.id] || [];

    return (
      <div className="space-y-4 ">
        <h4 className="text-lg font-bold text-[#472014] mb-3 mt-2">
          Applications ({applications.length})
        </h4>
        {applications.length === 0 && (
          <p className="text-gray-500 italic">No applications yet</p>
        )}
        {applications.map((application) => (
          <Card key={application.id} className="p-4 border-2 border-[#eb5e17] bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-[#472014] cursor-pointer" onClick={() => {
    window.location.href = `/${application.applicationType}-profile/${application.applicantDetails.id}`;
  }}>
                  {application.applicantDetails.name}
                </h5>
                <p className="text-gray-600">
                  {application.applicantDetails.email}
                </p>
                {application.applicantDetails.institution && (
                  <p className="text-gray-600">
                    <MapPin className="inline-block mr-1" size={16} />
                    {application.applicantDetails.institution}
                  </p>
                )}
                <p className="text-gray-600">
                  <Calendar className="inline-block mr-1" size={16} />
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700">{application.description}</p>
            </div>

            {application.resume && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-blue-600 hover:text-blue-800"
                onClick={() => window.open(application.resume, '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Resume
              </Button>
            </div>
          )}

          {project.status === "OPEN" && (
            <div className="mt-4 flex justify-end space-x-3">
              {(application.status === "PENDING" || !application.status) && (
                <>
                  <Button
                    onClick={() =>
                      handleChangeProjectStatus(
                        project.id,
                        "ONGOING",
                        application.id,
                        application.applicationType
                      )
                    }
                    className="bg-[#eb5e17] hover:bg-[#472014] text-white"
                  >
                    Accept Application
                  </Button>
                  <Button 
                    onClick={() => handleRejectApplication(project.id, application.id, application.applicationType)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleSetInReview(project.id, application.id, application.applicationType)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Set In Review
                  </Button>
                </>
              )}
              
              {application.status === "IN_REVIEW" && (
                <>
                  <div className="text-yellow-600 font-medium flex items-center mr-4">In Review</div>
                  <Button
                    onClick={() =>
                      handleChangeProjectStatus(
                        project.id,
                        "ONGOING",
                        application.id,
                        application.applicationType
                      )
                    }
                    className="bg-[#eb5e17] hover:bg-[#472014] text-white"
                  >
                    Accept Application
                  </Button>
                  <Button 
                    onClick={() => handleRejectApplication(project.id, application.id, application.applicationType)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {application.status === "REJECTED" && (
                <div className="text-red-600 font-medium">Application Rejected</div>
              )}
              
              {application.status === "ACCEPTED" && (
                <div className="text-green-600 font-medium">Application Accepted</div>
              )}
            </div>
          )}
          </Card>
        ))}
      </div>
    );
  };

  const renderProjectsList = () => (
    <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-4xl font-caveat text-[#472014]">
          <Globe className="mr-2" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {projects.map((project) => (
            <li
              key={project.id}
              className="border-b-2 border-[#eb5e17]/20 pb-6 last:border-b-0"
            >
              <div className="flex gap-2 items-center mb-4">
                <h3 className="text-xl font-bold text-[#472014]">
                  {project.topic}
                </h3>
                <Badge
                  className={`px-4 py-1 rounded-full ${
                    project.category === "RND_PROJECT"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  } text-white`}
                >
                  {project.category === "RND_PROJECT" ? "R&D" : "Internship"}
                </Badge>
                {/* project creation date */}
                <p className="text-sm text-gray-600">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not available'}
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                {project.content}
              </p>

              <div className="flex justify-between items-center mb-4">
                <Badge
                  className={`px-4 py-1 rounded-full ${
                    project.status === "OPEN"
                      ? "bg-green-500"
                      : project.status === "ONGOING"
                      ? "bg-[#003d82]"
                      : "bg-red-500"
                  } text-white`}
                >
                  {project.status}
                </Badge>
                {isLoggedInUser && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setProjectIDToDelete(project.id);
                      setIsModalOpen(true);
                    }}
                    className="m-2 text-white bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </Button>
                )}
              </div>

              {project.status === "OPEN" && (
                <Button
                onClick={() => {
                  if (applicationDetails[project.id]) {
                    // If applications are already loaded, remove them to collapse
                    setApplicationDetails((prev) => {
                      const newDetails = { ...prev };
                      delete newDetails[project.id];
                      return newDetails;
                    });
                  } else {
                    // If not loaded, fetch them
                    fetchApplicationDetails(project.id);
                  }
                }}
                className="w-full bg-[#eb5e17] hover:bg-[#472014] text-white"
              >
                <FileText className="mr-2" /> 
                {applicationDetails[project.id] ? "Hide Applications" : "View Applications"}
              </Button>
              )}

              {applicationDetails[project.id] &&
                renderProjectApplications(project)}

              {project.status === "ONGOING" && (
                <Button
                  onClick={() =>
                    handleChangeProjectStatus(project.id, "CLOSED")
                  }
                  className="w-full mt-4 bg-[#eb5e17] hover:bg-[#003d82] text-white"
                >
                  Complete Project
                </Button>
              )}
              {project.selectedApplicant && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-[#eb5e17]/20" >
                <h4 className="text-lg font-semibold text-[#472014] mb-3 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Selected Applicant
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Name:</span> {project.selectedApplicant.name}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <Mail className="mr-2 h-4 w-4" />
                    {project.selectedApplicant.email}
                  </p>
                  <p className="text-gray-700 mt-2">{project.selectedApplicant.description}</p>
                  <Button 
                    onClick={() => {
                      window.location.href = `/${project.selectedApplicant.type}-profile/${project.selectedApplicant.userId}`;
                    }}
                    className="mt-3 bg-[#003d82] hover:bg-[#472014] text-white"
                  >
                    View {project.selectedApplicant.type.charAt(0).toUpperCase() + project.selectedApplicant.type.slice(1)} Profile
                  </Button>
                </div>
              </div>
              )}
            </li>
          ))}
        </ul>
        
      </CardContent>
    </Card>
  );

  const renderNotificationsTab = () => (
    <TabsContent value="notifications">
      {isLoggedInUser && (
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              <Bell className="mr-2 text-[#eb5e17]" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  // <a href={"projects"}>
                  <li
                    key={notification.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <a href={notification.redirectionLink}>
                    <div>
                      <p
                        className={`${
                          notification.isRead
                            ? "text-gray-600"
                            : "font-semibold"
                        }`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: notification.content,
                          }}
                          className="text-[#472014]  line-clamp-2"
                        />
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        onClick={() => handleMarkAsRead(notification.id)}
                        size="sm"
                        className="bg-[#eb5e17] hover:bg-[#472014] text-white"
                      >
                        Mark as Read
                      </Button>
                    )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );

  // Main component render
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarWithBg />
      {isLoggedInUser && <GlobalChatBox isChatOpen={isChatOpen}/>}
      <main className="flex-grow">
        <motion.section
          className="relative bg-gradient-to-b from-[#eb5e17] to-[#686256] text-white py-24"
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white">
                    <AvatarImage
                      src={business.profileImageUrl || ""}
                      alt={business.companyName}
                    />
                    <AvatarFallback className="text-[#472014] bg-white">
                      {business.companyName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className="text-5xl font-extrabold mb-2 font-caveat text-black">
                    {business.companyName}
                  </h1>
                  <p className="text-2xl text-black">{business.industry}</p>
                  <p className="text-xl text-black">{business.location}</p>
                </div>
              </div>
              {!isLoggedInUser && (
                <Button className="bg-white px-4 py-2 border-2 border-white" onClick={handleContact}>
                  Send Message
                </Button>
              )}
              <div className="flex items-center space-x-2">
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
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-4xl font-caveat text-[#472014]">
                    <Building className="mr-2" />
                    Industry Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <ul className="space-y-4">
                    <li className="flex items-center text-black">
                      
                        Website/ Social Media : <a href={business.website || ""} className="text-blue-500 underline">{business.website || "N/A"}
                      </a>
                    </li>
                    <li>
                      <div className="text-[#472014] block mb-2">
                        Description: {business.description}
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {isLoggedInUser && (
                <>
                  <CreateProjectForm 
                    businessId={business.id} 
                    onProjectCreated={(newProject) => {
                      setProjects(prevProjects => {
                        const updatedProjects = [...prevProjects, newProject] as Project[];
                        // Sort projects by creation date, newest first
                        return updatedProjects.sort((a, b) => 
                          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        );
                      });
                    }}
                  />
                </>
              )}
            </motion.div>

            {isLoggedInUser && (
                <div className="mt-8">{renderProjectsList()}</div>
            )}
          </div>
        </section>

        {isLoggedInUser && (
          <>
            <section className="py-8">
              <div className="container mx-auto px-4">
                <EnrolledProjectsTabs
                  userId={Array.isArray(id) ? id[0] : id}
                  role="business"
                />
              </div>
            </section>
            <section className="py-8">
              <div className="container mx-auto px-4">
                <Tabs defaultValue="notifications">
                  <TabsList>
                    {isLoggedInUser && (
                      <TabsTrigger value="notifications">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </TabsTrigger>
                    )}
                  </TabsList>
                  {renderNotificationsTab()}
                  {isModalOpen && ConfirmationModal()}
                </Tabs>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
      <Toaster/>
    </div>
  );
};

export default BusinessProfilePage;
