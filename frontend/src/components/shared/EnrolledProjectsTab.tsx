// components/EnrolledProjectsTabs.tsx

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: string;
  category: string;
  business?: { id: string; companyName: string };
  professor?: { id: string; fullName: string };
  student?: { id: string; name: string };
}

interface EnrolledProjectsTabsProps {
  userId: string;
  role: "professor" | "student" | "business";
}

const EnrolledProjectsTabs: React.FC<EnrolledProjectsTabsProps> = ({
  userId,
  role,
}) => {
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [closedProjects, setClosedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrolledProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const ongoingResponse = await axios.get(
          `${API_URL}/project/enrolled/${role}/${userId}`,
          {
            params: { status: "ONGOING" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const closedResponse = await axios.get(
          `${API_URL}/project/enrolled/${role}/${userId}`,
          {
            params: { status: "CLOSED" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOngoingProjects(ongoingResponse.data);
        setClosedProjects(closedResponse.data);
      } catch (error) {
        console.error("Error fetching enrolled projects:", error);
        setError("Failed to fetch enrolled projects. Please try again.");
      }
    };

    fetchEnrolledProjects();
  }, [userId, role, router]);

  const renderProjects = (projects: Project[]) => (
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
            <Badge className={`px-4 py-2 rounded-full bg-blue-500 text-white`}>
              {project.category}
            </Badge>
          </div>
          <p className="text-gray-700 mb-4">
            {project.content && project.content.substring(0, 100)}...
          </p>
          <div className="flex justify-between items-center mb-4">
            {/* <Badge className="bg-[#eb5e17] text-white px-4 py-2 rounded-full">
              {project.}
            </Badge> */}
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
        </li>
      ))}
    </ul>
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Tabs defaultValue="ongoing">
      <TabsList>
        <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
        <TabsTrigger value="closed">Closed Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#472014]">
              Ongoing Enrolled Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ongoingProjects.length > 0 ? (
              renderProjects(ongoingProjects)
            ) : (
              <p>No ongoing projects.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="closed">
        <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#472014]">
              Closed Enrolled Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {closedProjects.length > 0 ? (
              renderProjects(closedProjects)
            ) : (
              <p>No closed projects.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EnrolledProjectsTabs;
