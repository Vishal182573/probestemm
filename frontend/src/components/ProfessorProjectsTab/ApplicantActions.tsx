// Components/ProjectsTab/ApplicantActions.tsx
import React from 'react';
import { Button } from "@/components/ui/button";

interface ApplicantActionsProps {
  status: string;
  projectId: string;
  applicantId: string;
  applicantType: string;
  onAssign: (projectId: string, applicantId: string, applicantType: string) => void;
  onReject: (projectId: string, applicantId: string, applicantType: string) => void;
  onSetInReview: (projectId: string, applicantId: string, applicantType: string) => void;
}

const ApplicantActions: React.FC<ApplicantActionsProps> = ({
  status,
  projectId,
  applicantId,
  applicantType,
  onAssign,
  onReject,
  onSetInReview,
}) => {
  if (status === 'PENDING') {
    return (
      <div className="flex items-center space-x-4">
        <Button
          size="sm"
          onClick={() => onAssign(projectId, applicantId, applicantType)}
          className="bg-[#eb5e17] text-white"
        >
          Assign
        </Button>
        <Button
          size="sm"
          onClick={() => onReject(projectId, applicantId, applicantType)}
          className="bg-red-600 text-white"
        >
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => onSetInReview(projectId, applicantId, applicantType)}
          className="bg-yellow-600 text-white"
        >
          Set In Review
        </Button>
      </div>
    );
  }

  if (status === 'IN_REVIEW') {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-yellow-600 font-medium">In Review</div>
        <Button
          size="sm"
          onClick={() => onAssign(projectId, applicantId, applicantType)}
          className="bg-[#eb5e17] text-white"
        >
          Assign
        </Button>
      </div>
    );
  }

  if (status === 'ACCEPTED') {
    return (
      <div className="text-green-600 font-medium">
        Assigned
      </div>
    );
  }

  return null;
};

export default ApplicantActions;