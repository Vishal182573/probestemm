// Components/ProjectsTab/ProjectList.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplicantsList from '@/components/ProfessorProjectsTab/ApplicantsList';

interface AppliedApplicant {
    id:string;
    professorId: string;
    studentId:string;
    businessId:string;
    name: string;
    email: string;
    description: string;
    resume: string;
    status: "PENDING" | "ACCEPTED" | "IN_REVIEW";
}

interface Project {
    createdAt: string | number | Date;
    id: string;
    topic: string;
    content: string;
    requirements: string;
    techDescription: string;
    difficulty?: "EASY" | "INTERMEDIATE" | "HARD";
    timeline?: string;
    tags: string[];
    status: "OPEN" | "ONGOING" | "CLOSED";
    type: "PROFESSOR_PROJECT" | "STUDENT_PROPOSAL" | "BUSINESS_PROJECT";
    category:
    | "PROFESSOR_COLLABORATION"
    | "INDUSTRY_COLLABORATION"
    | "INTERNSHIP"
    | "PHD_POSITION"
    | "RND_PROJECT";
    professor?: {
      fullName: string;
      email: string;
      phoneNumber: string;
      university: string;
      department: string;
    };
    deadline?: string;
    duration?: string;
}

interface ProjectListProps {
  projects: Project[];
  appliedApplicantsMap: {
    [projectId: string]: AppliedApplicant[];
  };
  isLoadingApplicants: {
    [projectId: string]: boolean;
  };
  onToggleApplicants: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onHandleAssignApplicant: (projectId: string, applicantId: string, applicantType: string) => void;
  onHandleRejectApplicant: (projectId: string, applicantId: string, applicantType: string) => void;
  onHandleSetInReview: (projectId: string, applicantId: string, applicantType: string) => void;
  onHandleCompleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  appliedApplicantsMap,
  isLoadingApplicants,
  onToggleApplicants,
  onDeleteProject,
  onHandleAssignApplicant,
  onHandleRejectApplicant,
  onHandleSetInReview,
  onHandleCompleteProject,
}) => {
  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <li key={project.id} className="border-b border-[#eb5e17] pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-2 max-w-60">
            <Badge variant="secondary" className="bg-[#686256] text-white">
              {project.status}
            </Badge>
            <p className="text-sm text-gray-600">
              {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Date not available'}
            </p>
          </div>

          <p className="text-sm text-[#686256] mb-2">
            {project.techDescription}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleApplicants(project.id)}
            >
              {appliedApplicantsMap[project.id] ? "Hide" : "View"} Applicants
            </Button>
            
            <Button
              size="sm"
              onClick={() => onDeleteProject(project.id)}
              className="text-white bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          </div>

          {/* Applicants List */}
          {appliedApplicantsMap[project.id] && (
            <ApplicantsList
              projectId={project.id}
              applicants={appliedApplicantsMap[project.id]}
              isLoading={isLoadingApplicants[project.id]}
              onAssign={onHandleAssignApplicant}
              onReject={onHandleRejectApplicant}
              onSetInReview={onHandleSetInReview}
            />
          )}

          {/* Complete Project Button */}
          {project.status === "ONGOING" && (
            <Button
              size="sm"
              onClick={() => onHandleCompleteProject(project.id)}
              className="mt-2 bg-[#eb5e17] text-white"
            >
              Complete Project
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;