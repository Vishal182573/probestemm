import { API_URL } from "@/constants";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
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
import Modal from "../ui/modal";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Rocket } from "lucide-react";
import { useForm } from "react-hook-form";

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
  onApply: (project: Project) => void;
  isApplied: boolean;
}

interface ProjectsListProps {
  projects: Project[];
  onApply: (project: Project) => void;
  appliedProjects: Set<string>;
}

// Modal component for project applications
interface ApplyModalProps {
  show: boolean;
  onClose: () => void;
  project: Project;
  onSuccess?: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onApply,
  isApplied,
}) => {
  // Router hook for navigation
  const router = useRouter();

  // State for dynamic application button text
  const [application_button, setapplication_button] = useState<string>("APPLY NOW");
  
  // Effect to set button text based on user role
  useEffect(() => {
    const role = localStorage.getItem("role");
  switch (role){
    case "professor" : if(project.category==="PROJECT") setapplication_button("Respond Now")
      case "business" : if(project.category==="PROJECT") setapplication_button("Respond Now")  
  }
  }, []);

  // Function to render different details based on project category
  const renderDetails = () => {
    switch (project.category) {
      case ProposalCategory.PROFESSOR_COLLABORATION:
        return (
          <>
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Application Deadline:</h4>
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
                <h4 className="font-semibold">Application Deadline:</h4>
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
                <h4 className="font-semibold">Application Deadline:</h4>
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
                <h4 className="font-semibold">Application Deadline:</h4>
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

  // Memoized function to determine if user can apply to project
  const canApply = useMemo(() => {
    const userRole = localStorage.getItem('role');
    const currentDate = new Date();
    
    // Check project status first (common for all)
    const isProjectOpen = project.status === 'OPEN';

    // Special handling for different roles and categories
    switch (project.category) {
      case ProposalCategory.PROFESSOR_COLLABORATION:
        // For professor, only check status
        if (userRole === 'professor') {
          return isProjectOpen;
        }
        return false

      case ProposalCategory.INDUSTRY_COLLABORATION:
        // Only allow business role for industry collaboration
        if (userRole === 'business') {
          return isProjectOpen;
        }
        return false;
      case ProposalCategory.PROJECT:
        if(userRole!='student'){
          return isProjectOpen;
        }
      return false;
      case ProposalCategory.RND_PROJECT:
        const roleOfUserRND = userRole;
        if(project.type=="PROFESSOR_PROJECT" && roleOfUserRND=="student") return isProjectOpen;
        else if(project.type=="BUSINESS_PROJECT" && roleOfUserRND=="professor") return isProjectOpen;
        return false 
      case ProposalCategory.INTERNSHIP:
        const roleOfUser = userRole;
        if(project.type=="PROFESSOR_PROJECT" && roleOfUser=="student") return isProjectOpen;
        else if(project.type=="BUSINESS_PROJECT" && roleOfUser=="student") return isProjectOpen;
        return false 
      case ProposalCategory.PHD_POSITION:
        // Original student application logic
        const isStudent = userRole === 'student';
        
        return isStudent && isProjectOpen;

      default:
        return false;
    }
  }, [project]);

  // Handler functions for user interactions
  const handleApply = () => {
    if (!canApply || isApplied) {
      alert('You are not eligible to apply for this project. Please check the eligibility criteria or project status.');
      return;
    }
    onApply(project);
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
            {/* <Button
              onClick={handleApply}
              disabled={!canApply}
              className={`
                flex-1 
                ${canApply 
                  ? 'bg-[#eb5e17] hover:bg-[#472014] text-white' 
                  : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {canApply ? `${application_button}` : 'Cannot Apply'}
            </Button> */}
            <Button
              onClick={handleApply}
              disabled={!canApply || isApplied}
              className={`
                flex-1 
                ${isApplied 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : canApply 
                    ? 'bg-[#eb5e17] hover:bg-[#472014] text-white' 
                    : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {isApplied 
                ? 'Applied' 
                : canApply 
                  ? `${application_button}` 
                  : 'Cannot Apply'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onApply, appliedProjects }) => {
  return (
    <section className="py-16 w-11/12 mx-auto">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onApply={onApply}
              isApplied={appliedProjects.has(project.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No projects available.</p>
      )}
    </section>
  );
};

const ApplyModal: React.FC<ApplyModalProps> = ({ show, onClose, project, onSuccess }) => {
  // Form handling with react-hook-form
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: localStorage.getItem("fullName") || "",
      email: localStorage.getItem("email") || "",
      phoneNumber: localStorage.getItem("phoneNumber") || "",
      description: "",
      images: null
    }
  });
  
  // Submission state management
  const [submitting, setSubmitting] = React.useState(false);

  // Effect to update form values from localStorage
  useEffect(() => {
    setValue('name', localStorage.getItem("fullName") || localStorage.getItem("companyName") || "");
    setValue('email', localStorage.getItem("email") || "");
    setValue('phoneNumber', localStorage.getItem("phoneNumber") || "");
  }, [setValue, show]);

  // Form submission handler
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    console.log(FormData);
    try {
      const formData = new FormData();
      formData.append("applicantId", localStorage.getItem("userId") || "");
      formData.append("applicantType", localStorage.getItem("role") || "");
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("description", data.description);
      
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file as File);
        });
      }
      
      await axios.post(`${API_URL}/project/${project.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local storage to track this application
      const appliedProjectsStr = localStorage.getItem('appliedProjects') || '[]';
      const appliedProjects = JSON.parse(appliedProjectsStr);
      appliedProjects.push(project.id);
      localStorage.setItem('appliedProjects', JSON.stringify(appliedProjects));
      
      reset();
      onSuccess?.(project.id);  // Call onSuccess with project ID
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("you already applied to this collection");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={`Apply`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Your Name"
              {...register("name")}
              className="w-full text-black bg-white"
              disabled
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              {...register("email")}
              className="w-full text-black bg-white"
              disabled
            />
          </div>
          {/* <div>
            <Input
              placeholder="Phone Number"
              {...register("phoneNumber")}
              className="w-full text-black bg-white"
              disabled
            />
          </div> */}
          <div>
            <Textarea
              placeholder="Application Description"
              {...register("description", { required: true })}
              className="w-full min-h-[150px]"
            />
          </div>
          <div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            Select your image
          </p>
          <p className="text-sm text-gray-500 mb-4">
            PNG, JPG, JPEG (max. 2 MB) (Optional)
          </p>
            <Input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              {...register("images")}
              className="w-full bg-white text-black"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#eb5e17] text-white hover:bg-[#472014]"
          >
            {submitting ? (
              <div className="flex items-center">
                <Rocket className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </div>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const RecentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(String);
  const [showModal, setShowModal] = useState(false); // Controls application modal visibility
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Currently selected project
  const [appliedProjects, setAppliedProjects] = useState<Set<string>>(new Set());

  // Modal control functions
  const openApplyModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeApplyModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleApplicationSuccess = (projectId: string) => {
    setAppliedProjects(prev => new Set([...prev, projectId]));
  };

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

  // Add new effect to fetch applied projects
  useEffect(() => {
    const fetchAppliedProjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userType = localStorage.getItem("role");
        
        if (!userId || !userType) return;
    
        const response = await axios.get(
          `${API_URL}/project/applied/${userId}?userType=${userType}`
        );
        
        setAppliedProjects(new Set(response.data));
      } catch (error) {
        console.error("Error fetching applied projects:", error);
      }
    };

    fetchAppliedProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-[#472014]">
        <ProjectsList 
          projects={projects} 
          onApply={openApplyModal}
          appliedProjects={appliedProjects}
        />
        {selectedProject && (
          <ApplyModal
            show={showModal}
            onClose={closeApplyModal}
            project={selectedProject}
            onSuccess={handleApplicationSuccess}
          />
        )}
    </div>
  );
};
