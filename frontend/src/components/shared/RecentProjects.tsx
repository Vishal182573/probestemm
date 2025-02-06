import { API_URL } from "@/constants";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import router, { useRouter } from "next/navigation";

// Enums defining the types of projects and proposal categories
enum ProjectType {
  BUSINESS_PROJECT = "BUSINESS_PROJECT",
  PROFESSOR_PROJECT = "PROFESSOR_PROJECT",
  STUDENT_PROPOSAL = "STUDENT_PROPOSAL",
}

// Categories for different types of proposals/projects
enum ProposalCategory {
  INTERNSHIP = "INTERNSHIP",
  PHD_POSITION = "PHD_POSITION",
  PROFESSOR_COLLABORATION = "PROFESSOR_COLLABORATION",
  STUDENT_OPPORTUNITY = "STUDENT_OPPORTUNITY",
  INDUSTRY_COLLABORATION = "INDUSTRY_COLLABORATION",
  RND_PROJECT = "RND_PROJECT",
  PROJECT = "PROJECT",
}

// TypeScript interface defining the structure of a Project
interface Project {
  id: string;
  topic: string;
  content: string;
  type: ProjectType;
  category: ProposalCategory;
  status: "OPEN" | "ONGOING" | "CLOSED";
  professorId: string;
  studentId: string;
  businessId: string;
  tags: string[];
  eligibility?: string;
  timeline?: string;
  deadline?: string;
  duration?: string;
  proposalFor?: string;
  isFunded?: boolean;
  fundDetails?: string;
  desirable?: string;
  techDescription?: string;
  requirements?: string;
  professor?: {
    id: string;
    fullName: string;
    email: string;
    department?: string;
  };
  business?: {
    id: string;
    companyName: string;
  };
  student?: {
    id: string;
    fullName: string;
    major?: string;
  };
}

// Component for individual project cards
interface ProjectCardProps {
  project: Project;
  index: number;
}

interface ProjectsListProps {
  projects: Project[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
}) => {
    const router = useRouter();
  // Function to render different details based on project category
  const renderDetails = () => {
    switch (project.category) {
      case ProposalCategory.PROFESSOR_COLLABORATION:
        return (
          <>
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Deadline:</h4>
                <p>{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </>
        );
      case ProposalCategory.INDUSTRY_COLLABORATION:
        return (
          <>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">What professor is looking for :</h4>
              <p>
                {project.requirements || "No specific requirements mentioned"}
              </p>
            </div>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Technical Description:</h4>
              <p>
                {project.techDescription || "No technical description provided"}
              </p>
            </div>
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Deadline:</h4>
                <p>{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </>
        );
      case ProposalCategory.PROJECT:
        return (
          <>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Topic:</h4>
              <p>{project.topic}</p>
            </div>
            {/* proposal for  */}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Proposal For:</h4>
              <p>{project.proposalFor}</p>
            </div>
            <div className="mb-2 text-black">
              <h4 className="font-semibold ">TechDescription:</h4>
              <p>{project.techDescription}</p>
            </div>
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Deadline:</h4>
                <p>{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </>
        );
      case ProposalCategory.STUDENT_OPPORTUNITY:
      case ProposalCategory.RND_PROJECT:
      case ProposalCategory.INTERNSHIP:
      case ProposalCategory.PHD_POSITION:
        return (
          <>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Eligibility:</h4>
              <p>{project.eligibility}</p>
            </div>
            {project.topic && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Topic:</h4>
                <p>{project.topic}</p>
              </div>
            )}
            {project.desirable && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Desirable Skills:</h4>
                <p>{project.desirable}</p>
              </div>
            )}
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Deadline:</h4>
                <p>{new Date(project.deadline).toLocaleDateString()}</p>
              </div>
            )}
            {project.duration && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Duration:</h4>
                <p>{project.duration}</p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Funding:</h4>
              <p>
                {!project.fundDetails &&
                  (project.isFunded
                    ? `Yes - ${project.fundDetails || "Funded"}`
                    : "No")}
              </p>
              {/* <p>{project.fundDetails && project.fundDetails}</p> */}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleRedirect = () => {
    switch (project.type) {
      case "STUDENT_PROPOSAL":
        router.push(`/student-profile/${project.studentId}`);
        break;
      case "PROFESSOR_PROJECT":
        router.push(`/professor-profile/${project.professorId}`);
        break;
      case "BUSINESS_PROJECT":
        router.push(`/business-profile/${project.businessId}`);
        break;
      default:
        console.error("Unknown project type");
    }
  };

  const getButtonLabel = () => {
    switch (project.type) {
      case "STUDENT_PROPOSAL":
        return "View Student";
      case "PROFESSOR_PROJECT":
        return "View Professor";
      case "BUSINESS_PROJECT":
        return "View Industry";
      default:
        return "Unknown Type";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col bg-white border-2 border-[#eb5e17] shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-[#eb5e17] text-white">
                  {project.category === "RND_PROJECT"
                    ? "R&D PROJECT"
                    : project.category.replace(/_/g, " ")}
                </Badge>
                <Badge
                  className={`
                    ${
                      project.status === "OPEN"
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-black"
                    }
                  `}
                >
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2">{project.content}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {renderDetails()}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[#472014] border-[#eb5e17]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <Button
              onClick={handleRedirect}
              variant="outline"
              className="flex-1 border-[#eb5e17] text-[#eb5e17] hover:bg-[#eb5e17]"
            >
              {getButtonLabel()}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  return (
    <section className="py-20 w-11/12 mx-auto">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No projects available.</p>
      )}
    </section>
  );
};

export const RecentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(String);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/project/recent`);
        console.log(response.data);
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        <ProjectsList projects={projects} />
    </div>
  );
};
