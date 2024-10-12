"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, Briefcase, Globe, Edit3, Tag, Plus } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  tags: string[];
  status: "OPEN" | "ONGOING" | "CLOSED";
}

const BusinessProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    topic: "",
    content: "",
    difficulty: "EASY" as const,
    timeline: new Date().toISOString().split('T')[0],
    tags: "",
    status: "OPEN" as const,
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/business/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBusiness(response.data);
        setProjects(response.data.projects || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [id, router]);

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(`${API_URL}/business/${id}/projects`, {
        ...newProject,
        tags: newProject.tags.split(',').map(tag => tag.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects([...projects, response.data]);
      setNewProject({
        topic: "",
        content: "",
        difficulty: "EASY",
        timeline: new Date().toISOString().split('T')[0],
        tags: "",
        status: "OPEN",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={business.profileImageUrl || ""} alt={business.companyName} />
                    <AvatarFallback>
                      {business.companyName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{business.companyName}</h1>
                  <p className="text-xl text-muted-foreground">{business.industry}</p>
                  <p className="text-lg text-muted-foreground">{business.location}</p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="w-full">
                  <Edit3 className="mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Building className="mr-2" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> {business.email}</li>
                    <li><strong>Phone:</strong> {business.phoneNumber}</li>
                    <li><strong>Website:</strong> {business.website || 'N/A'}</li>
                    <li><strong>Description:</strong> {business.description}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Briefcase className="mr-2" />
                    Create Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input
                      placeholder="Project Topic"
                      value={newProject.topic}
                      onChange={(e) =>
                        setNewProject({ ...newProject, topic: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Project Content"
                      value={newProject.content}
                      onChange={(e) =>
                        setNewProject({ ...newProject, content: e.target.value })
                      }
                    />
                    <select
                      value={newProject.difficulty}
                      onChange={(e) =>
                        setNewProject({ ...newProject, difficulty: e.target.value as "EASY" | "INTERMEDIATE" | "HARD" })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="EASY">Easy</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <Input
                      type="date"
                      value={newProject.timeline}
                      onChange={(e) =>
                        setNewProject({ ...newProject, timeline: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={newProject.tags}
                      onChange={(e) =>
                        setNewProject({ ...newProject, tags: e.target.value })
                      }
                    />
                    <Button onClick={handleCreateProject} className="w-full">
                      <Plus className="mr-2" /> Create Project
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Globe className="mr-2" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {projects.map((project) => (
                      <li key={project.id} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-semibold">{project.topic}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {project.content.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{project.difficulty}</Badge>
                          <Badge 
                            variant={project.status === "OPEN" ? "success" : 
                                     project.status === "ONGOING" ? "warning" : "destructive"}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Tag className="mr-2" />
                    Project Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(projects.flatMap(project => project.tags))).map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessProfilePage;