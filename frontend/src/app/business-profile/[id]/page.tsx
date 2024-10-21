"use client";
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
import { Building, Briefcase, Globe, Tag, Plus, User } from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

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
  business?: { id: string; companyName: string };
  professor?: { id: string; fullName: string };
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

  const [newProject, setNewProject] = useState<{
    topic: string;
    content: string;
    difficulty: "EASY" | "INTERMEDIATE" | "HARD";
    timeline: string;
    tags: string;
  }>({
    topic: "",
    content: "",
    difficulty: "EASY",
    timeline: new Date().toISOString().split("T")[0],
    tags: "",
  });

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");
        setIsLoggedInUser(id === loggedInUserId);

        const businessResponse = await axios.get(`${API_URL}/business/${id}`);
        setBusiness(businessResponse.data);

        if (isLoggedInUser && token) {
          const projectsResponse = await axios.get(
            `${API_URL}/project/business/${id}/projects`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProjects(projectsResponse.data);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/project/business`,
        {
          ...newProject,
          tags: newProject.tags.split(",").map((tag) => tag.trim()),
          businessId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProjects((prevProjects) => [...prevProjects, response.data]);
      setNewProject({
        topic: "",
        content: "",
        difficulty: "EASY",
        timeline: new Date().toISOString().split("T")[0],
        tags: "",
      });
      setError(null);
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppliedProfessors = async (projectId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/project/business/${projectId}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppliedProfessorsMap((prevMap) => ({
        ...prevMap,
        [projectId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching applied professors:", error);
      setError("Failed to fetch applied professors. Please try again.");
    }
  };

  const handleChangeProjectStatus = async (
    projectId: string,
    status: "OPEN" | "ONGOING" | "CLOSED",
    selectedProfessorId?: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axios.patch(
        `${API_URL}/project/business/${projectId}/status`,
        { status, selectedProfessorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status } : project
        )
      );

      // Clear applied professors for this project after changing status
      setAppliedProfessorsMap((prevMap) => {
        const newMap = { ...prevMap };
        delete newMap[projectId];
        return newMap;
      });
    } catch (error) {
      console.error("Error changing project status:", error);
      setError("Failed to change project status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center flex items-center justify-center h-screen bg-white">
        <div className="loader text-[#c1502e] font-caveat text-2xl">
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarWithBg />

      <main className="flex-grow">
        <motion.section
          className="relative bg-gradient-to-b from-[#c1502e] to-[#686256] text-white py-24"
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
                  <h1 className="text-5xl font-extrabold mb-2 font-caveat text-white">
                    {business.companyName}
                  </h1>
                  <p className="text-2xl text-white/90">{business.industry}</p>
                  <p className="text-xl text-white/80">{business.location}</p>
                </div>
              </div>
              <Button className="bg-[#c1502e] hover:bg-[#472014] text-white flex flex-end">
                Edit Profile
              </Button>
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
              <Card className="border-2 border-[#c1502e] shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-4xl font-caveat text-[#472014]">
                    <Building className="mr-2" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <strong className="text-[#472014] min-w-[100px]">
                        Email: {business.email}
                      </strong>
                    </li>
                    <li className="flex items-center">
                      <strong className="text-[#472014] min-w-[100px]">
                        Phone:{business.phoneNumber}
                      </strong>
                    </li>
                    <li className="flex items-center">
                      <strong className="text-[#472014] min-w-[100px]">
                        Website:{business.website || "N/A"}
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
                  <Card className="border-2 border-[#c1502e] shadow-xl bg-white text-[#472014]">
                    <CardHeader>
                      <CardTitle className="flex items-center text-4xl font-caveat text-[#472014]">
                        <Briefcase className="mr-2" />
                        Create Project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        className="space-y-4"
                        onSubmit={handleCreateProject}
                      >
                        <Input
                          placeholder="Project Topic"
                          value={newProject.topic}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              topic: e.target.value,
                            })
                          }
                          className="border-2 border-[#c1502e] rounded-lg p-3 bg-white"
                          required
                        />
                        <Textarea
                          placeholder="Project Content"
                          value={newProject.content}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              content: e.target.value,
                            })
                          }
                          className="border-2 border-[#c1502e] rounded-lg p-3"
                          required
                        />
                        <select
                          value={newProject.difficulty}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              difficulty: e.target.value as
                                | "EASY"
                                | "INTERMEDIATE"
                                | "HARD",
                            })
                          }
                          className="w-full p-3 border-2 border-[#c1502e] rounded-lg bg-white"
                          required
                        >
                          <option value="EASY">Easy</option>
                          <option value="INTERMEDIATE">Intermediate</option>
                          <option value="HARD">Hard</option>
                        </select>
                        <Input
                          type="date"
                          value={newProject.timeline}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              timeline: e.target.value,
                            })
                          }
                          className="border-2 border-[#c1502e] rounded-lg p-3 bg-white"
                          required
                        />
                        <Input
                          placeholder="Tags (comma-separated)"
                          value={newProject.tags}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              tags: e.target.value,
                            })
                          }
                          className="border-2 border-[#c1502e] rounded-lg p-3 bg-white"
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            "Creating..."
                          ) : (
                            <>
                              <Plus className="mr-2" /> Create Project
                            </>
                          )}
                        </Button>
                      </form>
                      {error && <p className="text-red-500 mt-2">{error}</p>}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-[#c1502e] shadow-xl bg-white">
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
                            className="border-b-2 border-[#c1502e]/20 pb-6 last:border-b-0"
                          >
                            <h3 className="text-xl font-bold text-[#472014] mb-2">
                              {project.topic}
                            </h3>
                            <p className="text-gray-700 mb-4">
                              {project.content.substring(0, 100)}...
                            </p>
                            <div className="flex justify-between items-center mb-4">
                              <Badge className="bg-[#c1502e] text-white px-4 py-2 rounded-full">
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
                                onClick={() =>
                                  fetchAppliedProfessors(project.id)
                                }
                                className="w-full bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                              >
                                <User className="mr-2" /> View Applied
                                Professors
                              </Button>
                            )}
                            {appliedProfessorsMap[project.id]?.length === 0 && (
                              <p className="text-gray-500 italic">
                                No professors applied yet
                              </p>
                            )}
                            {appliedProfessorsMap[project.id]?.length > 0 &&
                              project.status === "OPEN" && (
                                <div className="mb-4">
                                  <h4 className="text-lg font-bold text-[#472014] mb-3">
                                    Applied Professors:
                                  </h4>
                                  <ul className="space-y-4">
                                    {appliedProfessorsMap[project.id].map(
                                      (professor) => (
                                        <li
                                          key={professor.professorId}
                                          className="flex flex-col p-4 bg-gray-50 rounded-lg border-2 border-[#c1502e]"
                                        >
                                          <span className="text-lg font-bold text-[#472014]">
                                            {professor.name}
                                          </span>
                                          <span className="text-gray-600">
                                            {professor.email}
                                          </span>
                                          <span className="text-gray-600 mb-3">
                                            {professor.phoneNumber}
                                          </span>
                                          <Button
                                            onClick={() =>
                                              handleChangeProjectStatus(
                                                project.id,
                                                "ONGOING",
                                                professor.professorId
                                              )
                                            }
                                            className="bg-[#c1502e] hover:bg-[#003d82] text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                                          >
                                            Select Professor
                                          </Button>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            {project.status === "ONGOING" && (
                              <Button
                                onClick={() =>
                                  handleChangeProjectStatus(
                                    project.id,
                                    "CLOSED"
                                  )
                                }
                                className="w-full bg-[#c1502e] hover:bg-[#003d82] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                Complete Project
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-[#c1502e] shadow-xl bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-4xl font-caveat text-[#472014]">
                        <Tag className="mr-2" />
                        Project Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {Array.from(
                          new Set(projects.flatMap((project) => project.tags))
                        ).map((tag, index) => (
                          <Badge
                            key={index}
                            className="bg-[#c1502e]/10 text-[#472014] border-2 border-[#c1502e] px-4 py-2 rounded-full text-sm font-semibold"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessProfilePage;
