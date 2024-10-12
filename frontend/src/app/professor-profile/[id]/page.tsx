/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  blogs: Array<{ id: string; title: string; createdAt: string }>;
  projects: Array<{ id: string; topic: string; status: string }>;
  webinars: Array<{ id: string; title: string; date: string; status: string }>;
}

const ProfessorProfilePage: React.FC = () => {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [isWebinarDialogOpen, setIsWebinarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/professors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfessor(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching professor data:", error);
        setError("Failed to load professor data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchProfessorData();
  }, [id, router]);

  const handleCreateWebinar = async (webinarData: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/webinars`, webinarData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(`${API_URL}/professors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessor(response.data);
      setIsWebinarDialogOpen(false);
    } catch (error) {
      console.error("Error creating webinar:", error);
      setError("Failed to create webinar. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!professor) {
    return <div>Professor not found</div>;
  }

  const tabItems = [
    { id: "profile", label: "My Profile", icon: <GraduationCap /> },
    { id: "projects", label: "My Projects", icon: <Briefcase /> },
    { id: "webinars", label: "My Webinars", icon: <Video /> },
    { id: "blogs", label: "My Blogs", icon: <BookOpen /> },
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
                      {professor.projects.length > 0 ? (
                        <div className="space-y-6">
                          {["OPEN", "ONGOING", "CLOSED"].map((status) => (
                            <div key={status}>
                              <h3 className="text-xl font-semibold mb-2">
                                {status.charAt(0) +
                                  status.slice(1).toLowerCase()}{" "}
                                Projects
                              </h3>
                              <ul className="space-y-2">
                                {professor.projects
                                  .filter(
                                    (project) => project.status === status
                                  )
                                  .map((project) => (
                                    <li
                                      key={project.id}
                                      className="flex items-center justify-between"
                                    >
                                      <span>{project.topic}</span>
                                      <Badge
                                        variant={
                                          status === "CLOSED"
                                            ? "outline"
                                            : "secondary"
                                        }
                                      >
                                        {status}
                                      </Badge>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No projects listed yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

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
                              <Button>Create Webinar</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Create a New Webinar</DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(
                                    e.currentTarget
                                  );
                                  const webinarData =
                                    Object.fromEntries(formData);
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
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="webinar-topic">Topic</Label>
                                  <Input
                                    id="webinar-topic"
                                    name="topic"
                                    placeholder="Enter webinar topic"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="webinar-place">Place</Label>
                                  <Select name="place">
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
                                    type="date"
                                  />
                                </div>
                                <Button type="submit">
                                  Submit for Approval
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        {["UPCOMING", "COMPLETED", "PENDING"].map((status) => (
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
                              {professor.webinars
                                .filter((webinar) => webinar.status === status)
                                .map((webinar) => (
                                  <li
                                    key={webinar.id}
                                    className="flex items-center justify-between"
                                  >
                                    <span>{webinar.title}</span>
                                    <Badge
                                      variant={
                                        status === "COMPLETED"
                                          ? "secondary"
                                          : status === "PENDING"
                                          ? "outline"
                                          : "default"
                                      }
                                    >
                                      {webinar.date}
                                    </Badge>
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
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfessorProfilePage;
