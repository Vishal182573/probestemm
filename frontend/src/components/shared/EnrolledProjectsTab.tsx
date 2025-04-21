import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

// Define TypeScript interface for Project structure
interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: string;
  category: string;
  // Optional nested objects for different user types
  business?: { id: string; companyName: string; email: string };
  professor?: { id: string; fullName: string; email: string };
  student?: { id: string; name: string; email: string };
  createdAt: string;
  deadline: string;
}

// Define props interface for the EnrolledProjectsTabs component
interface EnrolledProjectsTabsProps {
  userId: string;
  role: "professor" | "student" | "business";
}

// Main component definition
const EnrolledProjectsTabs: React.FC<EnrolledProjectsTabsProps> = ({
  userId,
  role,
}) => {
  // State management for projects and error handling
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [closedProjects, setClosedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // useEffect hook to fetch enrolled projects when component mounts
  useEffect(() => {
    const fetchEnrolledProjects = async () => {
      try {
        // Check for authentication token
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch ongoing projects
        const ongoingResponse = await axios.get(
          `${API_URL}/project/enrolled/${role}/${userId}`,
          {
            params: { status: "ONGOING" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch closed projects
        const closedResponse = await axios.get(
          `${API_URL}/project/enrolled/${role}/${userId}`,
          {
            params: { status: "CLOSED" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Update state with fetched data
        setOngoingProjects(ongoingResponse.data);
        setClosedProjects(closedResponse.data);
      } catch (error) {
        console.error("Error fetching enrolled projects:", error);
        setError("Failed to fetch enrolled projects. Please try again.");
      }
    };

    fetchEnrolledProjects();
  }, [userId, role, router]);

  // Helper function to extract owner information from project
  const getOwnerInfo = (project: Project) => {
    if (project.business?.id) {
      return {
        id: project.business.id,
        name: project.business.companyName,
        email: project.business.email,
        type: 'business'
      };
    } else if (project.student?.id) {
      return {
        id: project.student.id,
        name: project.student.name,
        email: project.student.email,
        type: 'student'
      };
    } else if (project.professor?.id) {
      return {
        id: project.professor.id,
        name: project.professor.fullName,
        email: project.professor.email,
        type: 'professor'
      };
    }
    return null;
  };

  // Function to render project list with consistent styling
  const renderProjects = (projects: Project[]) => (
    <ul className="space-y-6">
      {projects.map((project) => {
        const owner = getOwnerInfo(project);
        return (
          <li
            key={project.id}
            className="border-b-2 border-[#eb5e17]/20 pb-6 last:border-b-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#472014]">
                {project.topic}
              </h3>
              <Badge className="px-4 py-2 rounded-full bg-blue-500 text-white">
                {project.category}
              </Badge>
            </div>
            <p className="text-gray-700 mb-4">
              {project.content && project.content.substring(0, 100)}...
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
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
                <div>
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">Created:</span> {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {project.deadline && (
                    <div className="text-sm text-gray-600">
                      <span className="font-bold">Deadline:</span> {new Date(project.deadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {owner && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{owner.name}</p>
                      <p className="text-sm text-gray-600">{owner.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      window.location.href = `/${owner.type}-profile/${owner.id}`;
                    }}
                    variant="outline"
                    className="hover:bg-[#eb5e17] hover:text-white transition-colors"
                  >
                    Visit Profile
                  </Button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  // Error handling display
  if (error) {
    return <div>{error}</div>;
  }

  // Render main component UI with tabs
  return (
    <Tabs defaultValue="ongoing">
      {/* Tab navigation */}
      <TabsList>
        <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
        <TabsTrigger value="closed">Closed Projects</TabsTrigger>
      </TabsList>

      {/* Ongoing projects tab content */}
      <TabsContent value="ongoing">
        <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#472014]">
              Ongoing Enrolled Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Conditional rendering based on projects availability */}
            {ongoingProjects.length > 0 ? (
              renderProjects(ongoingProjects)
            ) : (
              <p>No ongoing projects.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Closed projects tab content */}
      <TabsContent value="closed">
        <Card className="border-2 border-[#eb5e17] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#472014]">
              Closed Enrolled Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Conditional rendering based on projects availability */}
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

// Export the component
export default EnrolledProjectsTabs;