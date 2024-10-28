"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket,
  Mail,
  User,
  Clock,
  XCircle,
  UserCircle,
  GraduationCap,
  User2Icon,
} from "lucide-react";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Link from "next/link";
import Banner from "@/components/shared/Banner";
import { PROJECT } from "../../../public";
// import ContactForm from "@/components/shared/Feedback";
// import FeaturesDemo from "@/components/shared/TextImageComponent";
import { useRouter } from "next/navigation";

interface Project {
  title: string;
  id: string;
  topic: string;
  content: string;
  description: string;
  timeline: string;
  status: "OPEN" | "ONGOING" | "CLOSED" | "APPLIED";
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  tags: string[];
  category: string;
  subcategory: string;
  type: "BUSINESS" | "PROFESSOR";
  business?: { id: string; companyName: string };
  professor?: { id: string; fullName: string; email: string };
}

const ProjectsPage = () => {
  const [businessProjects, setBusinessProjects] = useState<Project[]>([]);
  const [professorProjects, setProfessorProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role);
    setUserId(id);

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const [businessResponse, professorResponse] = await Promise.all([
          axios.get(`${API_URL}/project/business`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/project/professor`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBusinessProjects(businessResponse.data);
        setProfessorProjects(professorResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const applyToProject = async (
    projectId: string,
    projectType: "BUSINESS" | "PROFESSOR"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId || !userRole) {
        setError("User information is missing. Please log in again.");
        return;
      }

      const endpoint =
        projectType === "BUSINESS" ? "business/apply" : "professor/apply";

      const response = await axios.post(
        `${API_URL}/project/${endpoint}`,
        {
          projectId,
          [userRole === "professor" ? "professorId" : "studentId"]: userId,
          [userRole === "professor" ? "professorName" : "studentName"]:
            localStorage.getItem("fullName"),
          [userRole === "professor" ? "professorEmail" : "studentEmail"]:
            localStorage.getItem("email"),
          [userRole === "professor"
            ? "professorPhoneNumber"
            : "studentPhoneNumber"]: localStorage.getItem("phoneNumber"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Update the project status in the UI
        const updateProjects = (projects: Project[]): Project[] =>
          projects.map((p) =>
            p.id === projectId ? { ...p, status: "APPLIED" } : p
          );

        if (projectType === "BUSINESS") {
          setBusinessProjects((prevProjects) => updateProjects(prevProjects));
        } else {
          setProfessorProjects((prevProjects) => updateProjects(prevProjects));
        }
      }
    } catch (error) {
      console.error("Error applying to project:", error);
      setError("Failed to apply to the project. Please try again.");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-[#472014] font-caveat text-2xl">
          <Rocket className="h-8 w-8 r-2 mr-2 text-[#c1502e]" />
          Loading projects...
        </p>
      </div>
    );
  }

  if (error) {
    router.push("/login");
    return;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      <NavbarWithBg />
      <main className="flex-grow">
        <Banner
          imageSrc={PROJECT}
          altText="project-banner-img"
          title="Cutting-edge STEM Projects"
          subtitle="Explore groundbreaking projects and collaborate with leading experts in the field. Push the boundaries of science and technology with Probe STEM."
        />
        <Tabs defaultValue="business" className="max-w-6xl mx-auto px-4 pt-4">
          <TabsList className="mb-8">
            <TabsTrigger
              value="business"
              className="text-[#472014] bg-[#f0d80f] data-[state=active]:bg-[#472014] data-[state=active]:text-white"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Business Projects
            </TabsTrigger>
            <TabsTrigger
              value="professor"
              className="text-[#472014] bg-[#f0d80f] data-[state=active]:bg-[#472014] data-[state=active]:text-white"
            >
              <UserCircle className="mr-2 h-5 w-5" />
              Professor Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="business">
            <ProjectsList
              projects={businessProjects}
              userRole={userRole}
              onApply={(id) => applyToProject(id, "BUSINESS")}
              projectType="BUSINESS"
            />
          </TabsContent>
          <TabsContent value="professor">
            <ProjectsList
              projects={professorProjects}
              userRole={userRole}
              onApply={(id) => applyToProject(id, "PROFESSOR")}
              projectType="PROFESSOR"
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const ProjectsList = ({
  projects,
  userRole,
  onApply,
  projectType,
}: {
  projects: Project[];
  userRole: string | null;
  onApply: (id: string) => void;
  projectType: "BUSINESS" | "PROFESSOR";
}) => {
  const filteredProjects = projects.filter(
    (project) => project.type === projectType
  );

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            userRole={userRole}
            onApply={onApply}
            projectType={projectType}
          />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  userRole,
  onApply,
  projectType,
}: {
  project: Project;
  index: number;
  userRole: string | null;
  onApply: (id: string) => void;
  projectType: "BUSINESS" | "PROFESSOR";
}) => {
  const difficultyColor = {
    EASY: "bg-green-500",
    INTERMEDIATE: "bg-yellow-500",
    HARD: "bg-red-500",
  };

  const canApply =
    (projectType === "BUSINESS" && userRole === "professor") ||
    (projectType === "PROFESSOR" && userRole === "student");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white border-[#c1502e] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#c1502e] to-[#686256] pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-white font-caveat">
              {project.title}
            </CardTitle>
            <Badge
              className={`${difficultyColor[project.difficulty]} text-white`}
            >
              {project.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-white mt-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center text-[#472014]">
              <User className="mr-2 h-4 w-4" />
              <span>
                {project.status === "ONGOING" || project.status === "CLOSED"
                  ? `Professor: ${project.professor?.fullName}`
                  : "Professor not assigned"}
              </span>
            </div>
            {(project.status === "ONGOING" || project.status === "CLOSED") &&
              project.professor && (
                <div className="flex items-center text-[#472014]">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email: {project.professor.email}</span>
                </div>
              )}

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span
                className={
                  project.status === "OPEN" ? "text-green-600" : "text-red-600"
                }
              >
                Status: {project.status}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-[#472014]">Topic:</h4>
            <p className="text-[#686256]">{project.topic}</p>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-[#472014]">Content:</h4>
            <p className="text-[#686256]">{project.content}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-[#c1502e] text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-[#472014]">
              Category: {project.category ? project.category : "No Category"}
            </h4>
            <h4 className="font-semibold text-[#472014]">
              Subcategory:{" "}
              {project.subcategory ? project.subcategory : "No Subcategory"}
            </h4>
          </div>
        </CardContent>
        <CardFooter>
          {canApply && (
            <Button
              className={`w-full rounded-full ${
                project.status === "OPEN"
                  ? "bg-[#c1502e] hover:bg-[#472014] text-white"
                  : "bg-gray-400 hover:bg-gray-500 cursor-not-allowed text-white"
              }`}
              disabled={project.status !== "OPEN"}
              onClick={() => onApply(project.id)}
            >
              {project.status === "OPEN" ? (
                <>
                  Apply Now
                  <Rocket className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {project.status}
                  <XCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}

          <Button className=" bg-[#c1502e] hover:bg-[#472014] text-white  w-full mt-4  rounded-full flex items-center justify-center">
            <User2Icon className="mr-2" />
            {projectType === "BUSINESS" ? (
              <Link href={`/business-profile/${project.business?.id}`}>
                {project.business?.companyName}
              </Link>
            ) : (
              <Link href={`/professor-profile/${project.professor?.id}`}>
                {project.professor?.fullName}
              </Link>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectsPage;
