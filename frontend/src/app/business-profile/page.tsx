"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUserTie,
  FaClipboardList,
  FaProjectDiagram,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { useRouter } from "next/navigation";

interface Professor {
  id: string;
  name: string;
  expertise: string;
  projects: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  professor: string;
  status: "In Progress" | "Completed" | "On Hold";
}

const BusinessProfilePage: React.FC = () => {
    const router = useRouter();
  const [professors] = useState<Professor[]>([
    {
      id: "1",
      name: "Dr. Jane Smith",
      expertise: "Artificial Intelligence",
      projects: 3,
    },
    { id: "2", name: "Prof. John Doe", expertise: "Data Science", projects: 5 },
    {
      id: "3",
      name: "Dr. Emily Brown",
      expertise: "Cybersecurity",
      projects: 2,
    },
  ]);
  const [projects] = useState<Project[]>([
    {
      id: "1",
      title: "AI-driven Customer Service",
      description: "Developing an AI chatbot for customer support",
      professor: "Dr. Jane Smith",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Data Analytics Dashboard",
      description: "Creating a real-time analytics dashboard",
      professor: "Prof. John Doe",
      status: "Completed",
    },
    {
      id: "3",
      title: "Blockchain Security Analysis",
      description: "Analyzing security vulnerabilities in blockchain systems",
      professor: "Dr. Emily Brown",
      status: "On Hold",
    },
  ]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: Date.now(),
  });

  const handleCreateProject = () => {
    // Here you would typically send the new project data to your backend
    console.log("Creating new project:", newProject);
    // Reset the form
    setNewProject({
      title: "",
      description: "",
      budget: "",
      timeline: Date.now(),
    });
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Business Profile
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaUserTie className="mr-2" /> Professors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {professors.map((professor) => (
                    <li
                      key={professor.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{professor.name}</h3>
                        <p className="text-sm text-gray-600">
                          {professor.expertise}
                        </p>
                      </div>
                      <span className="text-sm text-blue-600">
                        {professor.projects} projects
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaProjectDiagram className="mr-2" /> Create Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Budget"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Timeline (YYYY-MM-DD)"
                    value={newProject.timeline}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        timeline: new Date(e.target.value).getTime(),
                      })
                    }
                  />
                  <Button onClick={handleCreateProject} className="w-full">
                    <FaPlus className="mr-2" /> Create Project
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaClipboardList className="mr-2" /> My Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/projects/1`)}
                  >
                    {/*to be changed*/}
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">
                          {project.professor}
                        </span>
                        <span
                          className={`text-sm ${
                            project.status === "In Progress"
                              ? "text-yellow-600"
                              : project.status === "Completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default BusinessProfilePage;
