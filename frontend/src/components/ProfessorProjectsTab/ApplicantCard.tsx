// Components/ProjectsTab/ApplicantCard.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import ApplicantActions from '@/components/ProfessorProjectsTab/ApplicantActions';

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

interface ApplicantCardProps {
  applicant: AppliedApplicant;
  projectId: string;
  onAssign: (projectId: string, applicantId: string, applicantType: string) => void;
  onReject: (projectId: string, applicantId: string, applicantType: string) => void;
  onSetInReview: (projectId: string, applicantId: string, applicantType: string) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  projectId,
  onAssign,
  onReject,
  onSetInReview,
}) => {
  const getProfileLink = () => {
    if (applicant.professorId) return `/professor-profile/${applicant.professorId}`;
    if (applicant.studentId) return `/student-profile/${applicant.studentId}`;
    if (applicant.businessId) return `/business-profile/${applicant.businessId}`;
    return '#';
  };

  const getApplicantType = () => {
    if (applicant.professorId) return "professor";
    if (applicant.studentId) return "student";
    if (applicant.businessId) return "business";
    return "";
  };

  return (
    <>
      <div>
        <p 
          className="font-semibold text-gray-600 cursor-pointer" 
          onClick={() => window.location.href = getProfileLink()}
        >
          {applicant.name}
        </p>
        <p className="text-sm text-gray-600">{applicant.email}</p>
        <p className="text-sm text-gray-600">{applicant.description}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 bg-white text-blue-600 hover:text-blue-800"
          onClick={() => window.open(applicant.resume, '_blank')}
        >
          <FileText className="h-4 w-4" />
          View Resume
        </Button>
      </div>

      <ApplicantActions
        status={applicant.status}
        projectId={projectId}
        applicantId={applicant.id}
        applicantType={getApplicantType()}
        onAssign={onAssign}
        onReject={onReject}
        onSetInReview={onSetInReview}
      />
    </>
  );
};

export default ApplicantCard;