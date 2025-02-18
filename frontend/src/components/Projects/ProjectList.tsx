import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
  PROJECT="PROJECT"
}

// TypeScript interface defining the structure of a Project
interface Project {
  id: string;
  topic: string;
  content: string;
  type: ProjectType;
  category: ProposalCategory;
  status: "OPEN" | "ONGOING" | "CLOSED";
  professorId:string;
  studentId:string;
  businessId:string;
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
  createdAt: string | Date;
}

// Component to display the list of projects in a grid
interface ProjectsListProps {
  projects: Project[];
  onApply: (project: Project) => void;
  appliedProjects: Set<string>;
}

// Component for individual project cards
interface ProjectCardProps {
  project: Project;
  index: number;
  onApply: (project: Project) => void;
  isApplied: boolean;
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
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Technical Description:</h4>
              <p>{project.techDescription || 'No technical description provided'}</p>
            </div>
            {project.duration && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Project Duration:</h4>
                <p>
                  {project.duration}
                </p>
              </div>
            )}
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Application Deadline:</h4>
                <p>
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Funding:</h4>
              <p>{!project.fundDetails && (project.isFunded   ? `Yes - ${project.fundDetails || 'Funded'}` : "No")}</p>
            </div>
          </>
        );
      case ProposalCategory.INDUSTRY_COLLABORATION:
        return (
          <>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Technical Description:</h4>
              <p>{project.techDescription || 'No technical description provided'}</p>
            </div>
            {project.duration && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Project Duration:</h4>
                <p>
                  {project.duration}
                </p>
              </div>
            )}
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Application Deadline:</h4>
                <p>
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Funding:</h4>
              <p>{!project.fundDetails && (project.isFunded   ? `Yes - ${project.fundDetails || 'Funded'}` : "No")}</p>
            </div>
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
              <h4 className="font-semibold ">Technical Description:</h4>
              <p>{project.techDescription}</p>
            </div>
            {project.duration && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Project Duration:</h4>
                <p>
                  {project.duration}
                </p>
              </div>
            )}
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Application Deadline:</h4>
                <p>
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Funding:</h4>
              <p>{!project.fundDetails && (project.isFunded   ? `Yes - ${project.fundDetails || 'Funded'}` : "No")}</p>
            </div>
          </>
        );
      case ProposalCategory.STUDENT_OPPORTUNITY:
      case ProposalCategory.RND_PROJECT:
      case ProposalCategory.INTERNSHIP:
      case ProposalCategory.PHD_POSITION:
        return (
          <>
            {project.topic && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Topic:</h4>
                <p>{project.topic}</p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Technical Description:</h4>
              <p>{project.techDescription || 'No technical description provided'}</p>
            </div>
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Eligibility:</h4>
              <p>{project.eligibility}</p>
            </div>
            {project.desirable && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Desirable Skills:</h4>
                <p>{project.desirable}</p>
              </div>
            )}
            {project.duration && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Project Duration:</h4>
                <p>
                  {project.duration}
                </p>
              </div>
            )}
            {project.deadline && (
              <div className="mb-2 text-black">
                <h4 className="font-semibold">Application Deadline:</h4>
                <p>
                  {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
            )}
            <div className="mb-2 text-black">
              <h4 className="font-semibold">Funding:</h4>
              <p>{!project.fundDetails && (project.isFunded   ? `Yes - ${project.fundDetails || 'Funded'}` : "No")}</p>
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
    
    // Check project status and deadline first (common for all)
    const isProjectOpen = project.status === 'OPEN';
    const isDeadlinePassed = project.deadline ? new Date(project.deadline) < currentDate : false;
  
    // If deadline has passed or project is not open, user cannot apply
    if (isDeadlinePassed || !isProjectOpen) {
      return false;
    }
  
    // Special handling for different roles and categories
    switch (project.category) {
      case ProposalCategory.PROFESSOR_COLLABORATION:
        // For professor, only check status
        if (userRole === 'professor') {
          return true;
        }
        return false;
  
      case ProposalCategory.INDUSTRY_COLLABORATION:
        // Only allow business role for industry collaboration
        if (userRole === 'business') {
          return true;
        }
        return false;
  
      case ProposalCategory.PROJECT:
        if (userRole !== 'student') {
          return true;
        }
        return false;
  
      case ProposalCategory.RND_PROJECT:
        const roleOfUserRND = userRole;
        if (project.type === "PROFESSOR_PROJECT" && roleOfUserRND === "student") return true;
        else if (project.type === "BUSINESS_PROJECT" && roleOfUserRND === "professor") return true;
        return false;
  
      case ProposalCategory.INTERNSHIP:
        const roleOfUser = userRole;
        if (project.type === "PROFESSOR_PROJECT" && roleOfUser === "student") return true;
        else if (project.type === "BUSINESS_PROJECT" && roleOfUser === "student") return true;
        return false;
  
      case ProposalCategory.PHD_POSITION:
        // Original student application logic
        const isStudent = userRole === 'student';
        return isStudent;
  
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
      case 'STUDENT_PROPOSAL':
        router.push(`/student-profile/${project.studentId}`);
        break;
      case 'PROFESSOR_PROJECT':
        router.push(`/professor-profile/${project.professorId}`);
        break;
      case 'BUSINESS_PROJECT':
        router.push(`/business-profile/${project.businessId}`);
        break;
      default:
        console.error('Unknown project type');
    }
  };

  const getButtonLabel = () => {
    switch (project.type) {
      case 'STUDENT_PROPOSAL':
        return 'View Student';
      case 'PROFESSOR_PROJECT':
        return 'View Professor';
      case 'BUSINESS_PROJECT':
        return 'View Industry';
      default:
        return 'Unknown Type';
    }
  };

  function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
  
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
  
    return 'just now';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col bg-white">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div className="w-full flex justify-between mt-2 gap-2">
              <Badge className="bg-[#eb5e17] text-white h-fit">
                {project.category === "RND_PROJECT" ? "R&D PROJECT" :project.category.replace(/_/g, " ")}
              </Badge>
              <div className="flex flex-col justify-center items-end gap-2">
                <Badge 
                  className={`w-fit
                    ${project.status === 'OPEN' 
                      ? 'bg-green-500 text-black' 
                      : 'bg-red-500 text-black'}
                  `}
                >
                  {project.status}
                </Badge>
                {project.createdAt && (
                  <span className="text-xs text-gray-500">
                    {getRelativeTime(new Date(project.createdAt))}
                  </span>
                )}
              </div>
            </div>
          </div>
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
              : project.deadline && new Date(project.deadline) < new Date()
                ? 'Deadline Passed'
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

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onApply, appliedProjects }) => {
  return (
    <section className="py-20">
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