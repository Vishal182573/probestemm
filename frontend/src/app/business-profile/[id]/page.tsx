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
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Link from "next/link";
import Image from "next/image";
import { PROFESSORPAGE } from "../../../../public";
import CreateProjectForm from "@/components/shared/professorprojectCreationForm";
import EnrolledProjectsTabs from "@/components/shared/EnrolledProjectsTab";

type Notification = {
  id: string;
  type: "PROJECT_APPLICATION" | "PROJECT_ACCEPTED" | "PROJECT_COMPLETED";
  content: string;
  createdAt: string;
  isRead: boolean;
  businessId: string;
  projectId?: string;
};

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

interface ApplicationDetails {
  id: string;
  description: string;
  imageUrls: string[];
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
}

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
}

interface AppliedProfessor {
  professorId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const BusinessProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedProfessorsMap, setAppliedProfessorsMap] = useState<{
    [projectId: string]: AppliedProfessor[];
  }>({});
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [applicationDetails, setApplicationDetails] = useState<{
    [projectId: string]: ApplicationDetails[];
  }>({});

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");
        setIsLoggedInUser(id === loggedInUserId);

        const businessResponse = await axios.get(`${API_URL}/businesss/${id}`);
        setBusiness(businessResponse.data);

        // Fetch projects regardless of whether the user is logged in
        const projectsResponse = await axios.get(`${API_URL}/project`, {
          params: {
            type: "BUSINESS_PROJECT",
            businessId: id,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        setProjects(projectsResponse.data);

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
        })),
        ...response.data.studentApplications.map((app: any) => ({
          ...app,
          applicationType: "student",
        })),
        ...response.data.businessApplications.map((app: any) => ({
          ...app,
          applicationType: "business",
        })),
      ].map((app: any) => ({
        id: app.id,
        description: app.description,
        imageUrls: app.images || [],
        applicationType: app.applicationType,
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

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const renderProjectApplications = (project: Project) => {
    const applications = applicationDetails[project.id] || [];

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-[#472014] mb-3">
          Applications ({applications.length})
        </h4>
        {applications.length === 0 && (
          <p className="text-gray-500 italic">No applications yet</p>
        )}
        {applications.map((application) => (
          <Card key={application.id} className="p-4 border-2 border-[#eb5e17]">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-[#472014]">
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

            {application.imageUrls && application.imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {application.imageUrls.map((url, index) => (
                  <div key={index} className="relative h-32">
                    <Image
                      src={url}
                      alt={`Application attachment ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}

            {project.status === "OPEN" && (
              <div className="mt-4 flex justify-end">
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#472014]">
                  {project.topic}
                </h3>
                <Badge
                  className={`px-4 py-2 rounded-full ${
                    project.category === "RND_PROJECT"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  } text-white`}
                >
                  {project.category === "RND_PROJECT" ? "R&D" : "Internship"}
                </Badge>
              </div>

              <p className="text-gray-700 mb-4">
                {project.content.substring(0, 100)}...
              </p>

              <div className="flex justify-between items-center mb-4">
                <Badge className="bg-[#eb5e17] text-white px-4 py-2 rounded-full">
                  {project.difficulty}
                </Badge>
                <Badge
                  className={`px-4 py-2 rounded-full ${
                    project.status === "OPEN"
                      ? "bg-green-500"
                      : project.status === "ONGOING"
                      ? "bg-[#003d82]"
                      : "bg-red-500"
                  } text-white`}
                >
                  {project.status}
                </Badge>
              </div>

              {project.status === "OPEN" && (
                <Button
                  onClick={() => fetchApplicationDetails(project.id)}
                  className="w-full bg-[#eb5e17] hover:bg-[#472014] text-white"
                >
                  <FileText className="mr-2" /> View Applications
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
                  <li
                    key={notification.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
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
                          className="text-[#472014] text-2xl font-bold leading-tight line-clamp-2"
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarWithBg />

      <main className="flex-grow">
        <motion.section
          className="relative bg-gradient-to-b from-[#eb5e17] to-[#686256] text-white py-24"
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
                    <li className="flex items-center">
                      <strong className="text-[#472014] min-w-[100px]">
                        Website: {business.website || "N/A"}
                      </strong>
                    </li>
                    <li>
                      <strong className="text-[#472014] block mb-2">
                        Description: {business.description}
                      </strong>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {isLoggedInUser && (
                <>
                  <CreateProjectForm businessId={business.id} />
                </>
              )}
            </motion.div>

            <div className="mt-8">{renderProjectsList()}</div>
          </div>
        </section>
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
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessProfilePage;
