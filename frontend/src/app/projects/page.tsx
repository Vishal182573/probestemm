"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
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
  Calendar,
  User,
  Clock,
  XCircle,
  UserCircle,
  GraduationCap,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  timeline: string;
  status: "Open" | "Closed";
  professor?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

const ProjectsPage = () => {
  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "AI-Powered Smart City",
      description:
        "Develop an AI system to optimize urban infrastructure and services.",
      timeline: "3 months",
      status: "Open",
      professor: "Dr. Emily Johnson",
      difficulty: "Advanced",
      tags: ["AI", "Urban Planning", "IoT"],
    },
    {
      id: 2,
      title: "Quantum Computing Algorithms",
      description:
        "Research and implement novel quantum algorithms for cryptography.",
      timeline: "6 months",
      status: "Closed",
      difficulty: "Advanced",
      tags: ["Quantum Computing", "Cryptography", "Algorithms"],
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      description:
        "Design and prototype renewable energy systems for developing regions.",
      timeline: "4 months",
      status: "Open",
      professor: "Dr. Sarah Martinez",
      difficulty: "Intermediate",
      tags: ["Renewable Energy", "Sustainability", "Engineering"],
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="flex-grow">
        <ProjectsHero />
        <Tabs defaultValue="professors" className="max-w-6xl mx-auto px-4 ">
          <TabsList className="mb-8 ">
            <TabsTrigger
              className="text-lg
              font-semibold
              px-4
              py-2
              rounded-md
              bg-gray-800
              hover:bg-gray-700
              cursor-pointer
              transition-all
              duration-300"
              value="professors"
            >
              {<GraduationCap className="mr-2 h-5 w-5" />}
              For Professors
            </TabsTrigger>

            <TabsTrigger
              className="text-lg
              font-semibold
              px-4
              py-2
              rounded-md
              bg-gray-800
              hover:bg-gray-700
              cursor-pointer
              transition-all
              duration-300"
              value="students"
            >
              {<UserCircle className="mr-2 h-5 w-5" />}
              For Students
            </TabsTrigger>
          </TabsList>
          <TabsContent value="professors">
            <ProfessorProjectsList projects={projects} />
          </TabsContent>
          <TabsContent value="students">
            <StudentProjectsList projects={projects} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const ProjectsHero = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-900 to-gray-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-6 text-blue-400"
        >
          Cutting-Edge STEM Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-10 text-gray-300"
        >
          Explore groundbreaking projects and collaborate with leading experts
          in the field. Push the boundaries of science and technology with Probe
          STEM.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Explore Projects
            <Rocket className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const ProfessorProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProfessorProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const ProfessorProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const difficultyColor = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-gray-900 border-blue-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-800 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-white">
              {project.title}
            </CardTitle>
            <Badge
              className={`${difficultyColor[project.difficulty]} text-white`}
            >
              {project.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-gray-200 mt-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-300">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Timeline: {project.timeline}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <User className="mr-2 h-4 w-4" />
              <span>
                {project.professor
                  ? `Professor: ${project.professor}`
                  : "Professor: Not Assigned"}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span
                className={
                  project.status === "Open" ? "text-green-400" : "text-red-400"
                }
              >
                Status: {project.status}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-blue-600 text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className={`w-full ${
              project.status === "Open"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
            }`}
            disabled={project.status === "Closed"}
          >
            {project.status === "Open" ? (
              <>
                Apply Now
                <Rocket className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Closed
                <XCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const StudentProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <StudentProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const StudentProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const difficultyColor = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-gray-900 border-blue-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-800 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-white">
              {project.title}
            </CardTitle>
            <Badge
              className={`${difficultyColor[project.difficulty]} text-white`}
            >
              {project.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-gray-200 mt-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-300">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Timeline: {project.timeline}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <User className="mr-2 h-4 w-4" />
              <span>
                {project.professor
                  ? `Professor: ${project.professor}`
                  : "Professor: Not Assigned"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-blue-600 text-white"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Apply Now
            <Rocket className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectsPage;
