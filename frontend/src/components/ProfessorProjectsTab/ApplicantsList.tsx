// Components/ProjectsTab/ApplicantsList.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import ApplicantCard from '@/components/ProfessorProjectsTab/ApplicantCard';

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

interface ApplicantsListProps {
  projectId: string;
  applicants: AppliedApplicant[];
  isLoading: boolean;
  onAssign: (projectId: string, applicantId: string, applicantType: string) => void;
  onReject: (projectId: string, applicantId: string, applicantType: string) => void;
  onSetInReview: (projectId: string, applicantId: string, applicantType: string) => void;
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({
  projectId,
  applicants,
  isLoading,
  onAssign,
  onReject,
  onSetInReview,
}) => {
  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-[#eb5e17]" />;
  }

  if (applicants.length === 0) {
    return <p className="text-black">No applicants yet.</p>;
  }

  return (
    <div className="mt-4">
      <h5 className="text-md font-semibold mb-2 text-black">Applicants:</h5>
      <ul className="space-y-2">
        {applicants.map((applicant) => (
          <li key={applicant.id} className="flex items-center space-x-4">
            <ApplicantCard
              applicant={applicant}
              projectId={projectId}
              onAssign={onAssign}
              onReject={onReject}
              onSetInReview={onSetInReview}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantsList;