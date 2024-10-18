/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Briefcase,
  ExternalLink,
  Globe,
  GraduationCap,
  Video,
  BookOpen,
  Plus,
  User,
  Loader2,
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

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  degree: string;
  department: string;
  position: string;
  researchInterests: string;
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
  projects: Array<{ id: string; topic: string; status: string }>;
}

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
}

interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  tags: string[];
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: "PROFESSOR";
}

interface AppliedStudent {
  projectId: string;
  studentId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const ProfessorProfilePage: React.FC = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isWebinarDialogOpen, setIsWebinarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [appliedStudentsMap, setAppliedStudentsMap] = useState<{
    [projectId: string]: AppliedStudent[];
  }>({});
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

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
          const [webinarsResponse, projectsResponse] = await Promise.all([
            axios.get(`${API_URL}/webinars/professor/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${API_URL}/project/professor/${id}/projects`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setWebinars(webinarsResponse.data);
          setProjects(projectsResponse.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchProfessorData();
  }, [id, isLoggedInUser]);

  const handleCreateWebinar = async (webinarData: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/webinars`, webinarData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWebinars([...webinars, response.data]);
      setIsWebinarDialogOpen(false);
    } catch (error) {
      console.error("Error creating webinar:", error);
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

  const handleCreateProject = async (projectData: any) => {
    setIsCreatingProject(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/project/professor`,
        { ...projectData, type: "PROFESSOR", professorId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects([...projects, response.data]);
      setIsProjectDialogOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const fetchAppliedStudents = async (projectId: string) => {
    setIsLoadingApplicants(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/project/professor/${projectId}/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppliedStudentsMap((prevMap) => ({
        ...prevMap,
        [projectId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching applied students:", error);
      setError("Failed to fetch applied students. Please try again.");
    } finally {
      setIsLoadingApplicants(false);
    }
  };
  const handleChangeProjectStatus = async (
    projectId: string,
    status: "OPEN" | "ONGOING" | "CLOSED",
    selectedStudentId?: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/project/professor/${projectId}/status`,
        { status, selectedStudentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status } : project
        )
      );

      if (status === "ONGOING" || status === "CLOSED") {
        setAppliedStudentsMap((prevMap) => {
          const newMap = { ...prevMap };
          delete newMap[projectId];
          return newMap;
        });
      }
    } catch (error) {
      console.error("Error changing project status:", error);
      setError("Failed to change project status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center flex items-center justify-center h-screen">
        <div className="loader">Loading...</div>
        <div className="text-muted-foreground ml-2">please wait</div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!professor) {
    return <div>Professor not found</div>;
  }

  const renderProjectsTab = () => (
    <TabsContent value="projects">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-primary">
              <Briefcase className="mr-2" />
              My Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-end">
                <Dialog
                  open={isProjectDialogOpen}
                  onOpenChange={setIsProjectDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" />
                      Create Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a New Project</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const projectData = {
                          ...Object.fromEntries(formData),
                          tags: formData
                            .get("tags")
                            ?.toString()
                            .split(",")
                            .map((tag) => tag.trim()),
                          type: "PROFESSOR",
                        };
                        handleCreateProject(projectData);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="project-topic">Project Topic</Label>
                        <Input
                          id="project-topic"
                          name="topic"
                          placeholder="Enter project topic"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-content">Project Content</Label>
                        <Textarea
                          id="project-content"
                          name="content"
                          placeholder="Enter project content"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-difficulty">Difficulty</Label>
                        <Select name="difficulty" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="INTERMEDIATE">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="project-timeline">Timeline</Label>
                        <Input
                          id="project-timeline"
                          name="timeline"
                          type="date"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-tags">Tags</Label>
                        <Input
                          id="project-tags"
                          name="tags"
                          placeholder="Enter tags (comma-separated)"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isCreatingProject}>
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
                  </DialogContent>
                </Dialog>
              </div>
              {["OPEN", "ONGOING", "CLOSED"].map((status) => (
                <div key={status}>
                  <h3 className="text-xl font-semibold mb-2">
                    {status.charAt(0) + status.slice(1).toLowerCase()} Projects
                  </h3>
                  <ul className="space-y-4">
                    {projects
                      .filter((project) => project.status === status)
                      .map((project) => (
                        <li
                          key={project.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold">
                              {project.topic}
                            </h4>
                            <Badge
                              variant={
                                status === "CLOSED" ? "outline" : "secondary"
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.content.substring(0, 100)}...
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.tags.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {status === "OPEN" && (
                            <Button
                              onClick={() => fetchAppliedStudents(project.id)}
                              className="mr-2"
                              disabled={isLoadingApplicants}
                            >
                              {isLoadingApplicants ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <User className="mr-2" /> View Applicants
                                </>
                              )}
                            </Button>
                          )}
                          {status === "ONGOING" && (
                            <Button
                              onClick={() =>
                                handleChangeProjectStatus(project.id, "CLOSED")
                              }
                            >
                              Close Project
                            </Button>
                          )}
                          {appliedStudentsMap[project.id]?.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-semibold mb-2">
                                Applied Students:
                              </h5>
                              <ul className="space-y-2">
                                {appliedStudentsMap[project.id].map(
                                  (student) => (
                                    <li
                                      key={student.studentId}
                                      className="flex items-center justify-between bg-secondary p-2 rounded"
                                    >
                                      <div>
                                        <span className="font-medium">
                                          {student.name}
                                        </span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {student.email}
                                        </span>
                                      </div>
                                      {status === "OPEN" && (
                                        <Button
                                          onClick={() =>
                                            handleChangeProjectStatus(
                                              project.id,
                                              "ONGOING",
                                              student.studentId
                                            )
                                          }
                                          size="sm"
                                        >
                                          Select
                                        </Button>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {status === "OPEN" &&
                            (!appliedStudentsMap[project.id] ||
                              appliedStudentsMap[project.id].length === 0) && (
                              <p className="text-sm text-muted-foreground mt-2">
                                No students have applied yet.
                              </p>
                            )}
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
  );

  const tabItems = [
    { id: "profile", label: "My Profile", icon: <GraduationCap /> },
    ...(isLoggedInUser
      ? [
          { id: "projects", label: "My Projects", icon: <Briefcase /> },
          { id: "webinars", label: "My Webinars", icon: <Video /> },
          { id: "blogs", label: "My Blogs", icon: <BookOpen /> },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        <motion.section
          className="relative bg-secondary text-secondary-foreground py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
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
                  <h1 className="text-4xl font-bold mb-2">
                    {professor.fullName}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {professor.title}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {professor.university}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {professor.department}
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                {professor.website && (
                  <a
                    className="btn btn-outline flex items-center"
                    href={professor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                  </a>
                )}
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google Scholar
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="flex justify-center bg-background p-2 rounded-lg">
                {tabItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex items-center space-x-2 px-4 py-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <GraduationCap className="mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>
                          <strong>Email:</strong> {professor.email}
                        </li>
                        <li>
                          <strong>Phone:</strong> {professor.phoneNumber}
                        </li>
                        <li>
                          <strong>Location:</strong> {professor.location}
                        </li>
                        <li>
                          <strong>Degree:</strong> {professor.degree || "N/A"}
                        </li>
                        <li>
                          <strong>Position:</strong> {professor.position}
                        </li>
                        <li>
                          <strong>Research Interests:</strong>{" "}
                          {professor.researchInterests}
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
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
                              <Badge variant="outline" className="mr-2">
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <Briefcase className="mr-2" />
                        Positions Held
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {professor.positions.length > 0 ? (
                        <ul className="space-y-2">
                          {professor.positions.map((position) => (
                            <li key={position.id} className="flex items-center">
                              <Badge variant="outline" className="mr-2">
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
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-2xl font-bold text-primary">
                            <BookOpen className="mr-2" />
                            My Blogs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {professor?.blogs && professor.blogs.length > 0 ? (
                            <ul className="space-y-4">
                              {professor.blogs.map((blog: any) => (
                                <li key={blog.id} className="border-b pb-4">
                                  <h3 className="text-xl font-semibold mb-2">
                                    {blog.title}
                                  </h3>
                                  <p className="text-muted-foreground mb-2">
                                    {new Date(
                                      blog.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="mb-2">
                                    {blog.content.length > 150
                                      ? `${blog.content.substring(0, 150)}...`
                                      : blog.content}
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <Badge variant="secondary">
                                      {blog.likes} Likes
                                    </Badge>
                                    <Badge variant="outline">
                                      {blog.dislikes} Dislikes
                                    </Badge>

                                    <Badge variant="outline">
                                      {blog.comments.length} Comments
                                    </Badge>
                                    <Link href={`/blogs/${blog.id}`}>
                                      <Button variant="outline">
                                        View Blog
                                      </Button>
                                    </Link>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No blogs posted yet.</p>
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
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-2xl font-bold text-primary">
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
                                  <Button>Request Webinar</Button>
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
                                        ...Object.fromEntries(formData),
                                        professorId: id,
                                        isOnline:
                                          formData.get("place") === "online",
                                        maxAttendees: parseInt(
                                          formData.get("maxAttendees") as string
                                        ),
                                        duration: parseInt(
                                          formData.get("duration") as string
                                        ),
                                      };
                                      handleCreateWebinar(webinarData);
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
                                <ul className="space-y-2">
                                  {webinars
                                    .filter(
                                      (webinar) => webinar.status === status
                                    )
                                    .map((webinar) => (
                                      <li
                                        key={webinar.id}
                                        className="flex items-center justify-between"
                                      >
                                        <span>{webinar.title}</span>
                                        <div className="flex items-center space-x-2">
                                          <Badge
                                            variant={
                                              status === "COMPLETED"
                                                ? "secondary"
                                                : status === "PENDING"
                                                ? "outline"
                                                : "default"
                                            }
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
