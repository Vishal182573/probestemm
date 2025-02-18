import { API_URL } from "@/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ProjectsList } from "../Projects/ProjectList";
import { ApplyModal } from "../Projects/ApplyModal";

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
  createdAt: string | Date;
}

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
