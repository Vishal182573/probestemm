/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Bell,
  Folder,
  Loader2,
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PROFESSORPAGE } from "../../../../public";
import StudentProposalForm from "@/components/shared/studentProposal";
import EnrolledProjectsTabs from "@/components/shared/EnrolledProjectsTab";
import GlobalChatBox from "@/components/shared/GlobalChatBox";
interface Student {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  location: string;
  imageUrl: string | null;
  university: string | null;
  course: string | null;
  researchHighlights: Array<{ id: string; title: string; status: string }>;
  experience: string | null;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    passingYear: string;
  }>;
  achievements: Array<{ id: string; year: string; description: string }>;
  discussions: Array<{
    id: string;
    title: string;
    category: string;
    subcategory: string;
    status: string;
    upvotes: number;
    downvotes: number;
  }>;
  projects: Array<{
    id: string;
    topic: string;
    content: string;
    status: string;
    techDescription: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
}

type Notification = {
  id: string;
  type:
    | "COMMENT"
    | "LIKE"
    | "DISLIKE"
    | "DISCUSSION_ANSWER"
    | "DISCUSSION_VOTE";
  content: string;
  createdAt: string;
  isRead: boolean;
  studentId: string;
  discussionId?: string;
  redirectionLink?:string
};

interface AppliedApplicant {
  id: string;
  businessId:string;
  professorId:string;
  name: string;
  email: string;
  description: string;
  images: string[];
}

interface ApplicationsResponse {
  professorApplications: AppliedApplicant[];
  studentApplications: AppliedApplicant[];
  businessApplications: AppliedApplicant[];
}

const StudentProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const [studentResponse, notificationsResponse] = await Promise.all([
          axios.get(`${API_URL}/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/notifications/student/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStudent(studentResponse.data);
        setNotifications(notificationsResponse.data);
        setUnreadCount(
          notificationsResponse.data.filter((n: Notification) => !n.isRead)
            .length
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const [appliedApplicantsMap, setAppliedApplicantsMap] = useState<{
    [projectId: string]: AppliedApplicant[];
  }>({});

  // State for loading applicants
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<{
    [projectId: string]: boolean;
  }>({});

  // Function to fetch applicants for a specific project
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

  const handleContact = async ()=>{
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${API_URL}/chat/rooms`,
        {
          userOneId:id,
          userOneType:"student",
          userTwoId:localStorage.getItem("userId"),
          userTwoType:localStorage.getItem("role")
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response.status == 200){
          router.push(`/${localStorage.getItem("role")}-profile/${localStorage.getItem("userId")}`)
      }

    } catch (error:any) {
      console.error("Error marking notification as read:", error);
      setError(error.message);
    }
  }

  // Toggle applicants display
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

  const userId = localStorage.getItem("userId");
  const isOwnProfile = student?.id === userId;

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
    return <div className="text-[#eb5e17] text-center p-4">{error}</div>;
  }

  if (!student) {
    return (
      <div className="text-[#472014] text-center p-4">Student not found</div>
    );
  }

  const staggerChildren = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };


  const renderNotificationsTab = () => (
    <TabsContent value="notifications">
      {isOwnProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                <Bell className="mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <ul className="space-y-6">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eb5e17]/10 pb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <a href={notification.redirectionLink}>
                      <div className="flex-grow mb-4 sm:mb-0">
                        <p
                          className={`text-[#472014] ${
                            notification.isRead
                              ? "text-[#472014]/70"
                              : "font-semibold"
                          }`}
                        >
                          {notification.content}
                        </p>
                        <p className="text-sm text-[#686256] mt-1 font-medium">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="sm"
                          className="bg-[#eb5e17] hover:bg-[#472014] text-white transition-colors duration-300 w-full sm:w-auto"
                        >
                          Mark as Read
                        </Button>
                      )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#686256] text-center py-8 font-medium">
                  No notifications yet.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </TabsContent>
  );

  const renderEnrolledProjectsTab = () => (
    <TabsContent value="enrolled-projects">
      <section className="py-8">
        <div className="container mx-auto px-4">
          <EnrolledProjectsTabs
            userId={Array.isArray(id) ? id[0] : id}
            role="student"
          />
        </div>
      </section>
    </TabsContent>
  );

  const renderProposalTab = () => (
    <TabsContent value="proposal">
      {isOwnProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StudentProposalForm studentId={student.id} />
        </motion.div>
      )}
    </TabsContent>
  );

  const renderProjectsTab = () => (
    <TabsContent value="projects">
      {isOwnProfile && (
        <Card className="border border-[#eb5e17] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
              My Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.projects && student.projects.length > 0 ? (
              <ul className="space-y-4">
                {student.projects.map((project) => (
                  <li 
                    key={project.id} 
                    className="border-b border-[#eb5e17] pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-[#472014]">
                        {project.topic || "Untitled Project"}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-[#686256] text-white"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-[#686256] mb-2">
                      Content: {project.content}
                    </p>
                    
                    {project.techDescription && (
                      <p className="text-sm text-[#686256] mb-2">
                        Tech Description: {project.techDescription}
                      </p>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 mr-2"
                      onClick={() => toggleApplicants(project.id)}
                    >
                      {appliedApplicantsMap[project.id] ? "Hide" : "View"}{" "}
                      Applicants
                    </Button>

                    {appliedApplicantsMap[project.id] && (
                      <div className="mt-4">
                        <h5 className="text-md font-semibold mb-2 text-black">
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
                                  className="flex items-center space-x-4 cursor-pointer"
                                  onClick={() => {
                                    const route = applicant.professorId
                                      ? `/professor-profile/${applicant.professorId}`
                                      : `/business-profile/${applicant.businessId}`;
                                    window.location.href = route;
                                  }}
                                >
                                  <div>
                                    <p className="font-semibold text-gray-600">
                                      {applicant.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.email}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {applicant.description}
                                    </p>
                                    {applicant.images && applicant.images[0] && (
                                      <Image
                                        src={applicant.images[0]}
                                        alt="Resume"
                                        width={100}
                                        height={100}
                                      />
                                    )}
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-black">No applicants yet.</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[#686256]">No projects found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      <NavbarWithBg />
      {isOwnProfile && <GlobalChatBox/>
      }

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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white">
                    <AvatarImage
                      src={student.imageUrl || ""}
                      alt={student.fullName}
                    />
                    <AvatarFallback className="bg-[#472014] text-white">
                      {student.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-extrabold mb-2 font-caveat text-black">
                    {student.fullName}
                  </h1>
                  <p className="text-xl font-bold text-black">
                    {student.course}
                  </p>
                  <p className="text-lg text-black">{student.university}</p>
                </div>
              </div>
              <Button className="bg-white px-4 py-2 border-2 border-white" onClick={handleContact}>
                    Contact User
              </Button>

              {isOwnProfile && (
                <Link href={"/edit-profile"}>
                  <Button className="bg-white px-4 py-2 border-2 border-white">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                    <Star className="mr-2" />
                    Research Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-2">
                    {student.researchHighlights.map((highlight) => (
                      <li key={highlight.id} className="flex items-center">
                        <Badge
                          variant="secondary"
                          className="mr-2 bg-[#eb5e17]/10 text-[#eb5e17] font-semibold"
                        >
                          {highlight.status}
                        </Badge>
                        <span className="font-medium">{highlight.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                    <Briefcase className="mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014] font-medium">
                  <p>{student.experience || "No experience added yet."}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                    <GraduationCap className="mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-4">
                    {student.education.map((edu) => (
                      <li key={edu.id}>
                        <h3 className="font-bold text-[#472014]">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-[#686256] font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-[#686256] font-medium">
                          Passing Year: {edu.passingYear}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                    <Award className="mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-2">
                    {student.achievements.map((achievement) => (
                      <li key={achievement.id} className="flex items-center">
                        <Badge
                          variant="outline"
                          className="mr-2 border-[#eb5e17] text-[#eb5e17] font-semibold"
                        >
                          {achievement.year}
                        </Badge>
                        <span className="font-medium">
                          {achievement.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {isOwnProfile && (
                <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
                      <GraduationCap className="mr-2" />
                      Discussions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[#472014]">
                    <ul className="space-y-2">
                      {student.discussions.map((discussion) => (
                        <li key={discussion.id}>
                          <h3 className="font-bold">{discussion.title}</h3>
                          <p className="text-sm text-[#686256] font-medium">
                            Category: {discussion.category} /{" "}
                            {discussion.subcategory}
                          </p>
                          <p className="text-sm text-[#686256] font-medium">
                            Status: {discussion.status}
                          </p>
                          <p className="text-sm text-[#686256] font-medium">
                            Upvotes: {discussion.upvotes}, Downvotes:{" "}
                            {discussion.downvotes}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="notifications">
              <TabsList>
                {isOwnProfile && (
                  <>
                    <TabsTrigger value="notifications">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </TabsTrigger>
                    <TabsTrigger value="projects">My Proposals</TabsTrigger>
                    <TabsTrigger value="proposal">Submit Proposal</TabsTrigger>
                    <TabsTrigger value="enrolled-projects">
                      Enrolled Projects
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              {renderNotificationsTab()}
              {renderProjectsTab()}
              {renderProposalTab()}
              {renderEnrolledProjectsTab()}
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfilePage;
