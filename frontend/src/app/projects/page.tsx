// page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket,
  GraduationCap,
  UserCircle,
  Building,
  Book,
  Calendar,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { PROJECT } from "../../../public";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

enum ProjectType {
  BUSINESS_PROJECT = "BUSINESS_PROJECT",
  PROFESSOR_PROJECT = "PROFESSOR_PROJECT",
  STUDENT_PROPOSAL = "STUDENT_PROPOSAL",
}

enum ProposalCategory {
  INTERNSHIP = "INTERNSHIP",
  PHD_POSITION = "PHD_POSITION",
  PROFESSOR_COLLABORATION = "PROFESSOR_COLLABORATION",
  STUDENT_OPPORTUNITY = "STUDENT_OPPORTUNITY",
  INDUSTRY_COLLABORATION = "INDUSTRY_COLLABORATION",
  RND_PROJECT = "RND_PROJECT",
}

interface Project {
  id: string;
  topic: string;
  content: string;
  type: ProjectType;
  category: ProposalCategory;
  status: "OPEN" | "ONGOING" | "CLOSED";
  tags: string[];
  eligibility?: string;
  timeline?: string;
  duration?: {
    startDate: string;
    endDate: string;
  } | null;
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

const ProjectsPage: React.FC = () => {
  const [, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("professors");
  const [activeCategory, setActiveCategory] = useState<ProposalCategory | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/project`, {
          params: {
            type:
              activeTab === "professors"
                ? ProjectType.PROFESSOR_PROJECT
                : activeTab === "industry"
                ? ProjectType.BUSINESS_PROJECT
                : ProjectType.STUDENT_PROPOSAL,
            category: activeCategory || undefined,
          },
        });
        setProjects(response.data);
        setFilteredProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeTab, activeCategory]);

  const getCategoryFilters = () => {
    switch (activeTab) {
      case "professors":
        return (
          <div className="flex gap-2">
            <Button
              variant={
                activeCategory === ProposalCategory.PROFESSOR_COLLABORATION
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveCategory(ProposalCategory.PROFESSOR_COLLABORATION)
              }
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Professor Collaboration
            </Button>
            <Button
              variant={
                activeCategory === ProposalCategory.STUDENT_OPPORTUNITY
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveCategory(ProposalCategory.PHD_POSITION)
              }
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Student Opportunities
            </Button>
            <Button
              variant={
                activeCategory === ProposalCategory.INDUSTRY_COLLABORATION
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveCategory(ProposalCategory.INDUSTRY_COLLABORATION)
              }
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Building className="mr-2 h-4 w-4" />
              Industry Collaboration
            </Button>
          </div>
        );

      case "industry":
        return (
          <div className="flex gap-2">
            <Button
              variant={
                activeCategory === ProposalCategory.RND_PROJECT
                  ? "default"
                  : "outline"
              }
              onClick={() => setActiveCategory(ProposalCategory.RND_PROJECT)}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Book className="mr-2 h-4 w-4" />
              R&D Projects
            </Button>
            <Button
              variant={
                activeCategory === ProposalCategory.INTERNSHIP
                  ? "default"
                  : "outline"
              }
              onClick={() => setActiveCategory(ProposalCategory.INTERNSHIP)}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Internships
            </Button>
          </div>
        );

      case "students":
        return (
          <div className="flex gap-2">
            <Button
              variant={
                activeCategory === ProposalCategory.RND_PROJECT
                  ? "default"
                  : "outline"
              }
              onClick={() => setActiveCategory(ProposalCategory.RND_PROJECT)}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Book className="mr-2 h-4 w-4" />
              R&D Proposals
            </Button>
            <Button
              variant={
                activeCategory === ProposalCategory.PHD_POSITION
                  ? "default"
                  : "outline"
              }
              onClick={() => setActiveCategory(ProposalCategory.PHD_POSITION)}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Research Proposals
            </Button>
            <Button
              variant={
                activeCategory === ProposalCategory.INTERNSHIP
                  ? "default"
                  : "outline"
              }
              onClick={() => setActiveCategory(ProposalCategory.INTERNSHIP)}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Internship Proposals
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const openApplyModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeApplyModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-[#472014] font-caveat text-2xl">
          <Rocket className="h-8 w-8 mr-2 text-[#eb5e17]" />
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      <NavbarWithBg />
      <main className="flex-grow">
        <Banner
          imageSrc={PROJECT}
          altText="project-banner-img"
          title="Cutting-edge STEM Projects"
          subtitle="Explore groundbreaking projects and collaborate with leading experts"
        />

        <div className="max-w-6xl mx-auto px-4 pt-4">
          <Tabs
            defaultValue="professors"
            onValueChange={(value) => {
              setActiveTab(value);
              setActiveCategory(null);
            }}
          >
            <TabsList className="mb-8">
              <TabsTrigger value="professors">
                <UserCircle className="mr-2 h-5 w-5" />
                Professor Projects
              </TabsTrigger>
              <TabsTrigger value="industry">
                <Building className="mr-2 h-5 w-5" />
                Industry Projects
              </TabsTrigger>
              <TabsTrigger value="students">
                <GraduationCap className="mr-2 h-5 w-5" />
                Student Proposals
              </TabsTrigger>
            </TabsList>

            <div className="mb-8">{getCategoryFilters()}</div>

            <ProjectsList
              projects={filteredProjects}
              onApply={openApplyModal}
            />
          </Tabs>
        </div>
      </main>
      <Footer />

      {selectedProject && (
        <ApplyModal
          show={showModal}
          onClose={closeApplyModal}
          project={selectedProject}
        />
      )}
    </div>
  );
};

interface ProjectsListProps {
  projects: Project[];
  onApply: (project: Project) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onApply }) => {
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
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No projects available.</p>
      )}
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onApply: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onApply,
}) => {
  const userRole = localStorage.getItem("role");
  
  const renderProfessorCollaborationCard = () => (
    <>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <p>{project.content}</p>
        </div>
        <div className="mb-4">
          <Badge variant="outline" className="mr-2">
            Status: {project.status}
          </Badge>
        </div>
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
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            // Add navigation to profile
            console.log("Navigate to profile:", project.professor?.id);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        {userRole === "professor" && (
          <Button
            onClick={() => onApply(project)}
            className="flex-1 bg-[#eb5e17] hover:bg-[#472014] text-white"
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </>
  );

  const renderStudentCard = () => (
    <>
      <CardContent className="flex-grow">
        <div className="mb-2">
          <h4 className="font-semibold">Description:</h4>
          <p>{project.content}</p>
        </div>
        <div className="mb-2">
          <h4 className="font-semibold">Eligibility:</h4>
          <p>{project.eligibility}</p>
        </div>
        {project.duration && (
          <div className="mb-2">
            <h4 className="font-semibold">Duration:</h4>
            <p>
              {new Date(project.duration.startDate).toLocaleDateString()} -{" "}
              {new Date(project.duration.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
        <div className="mb-2">
          <h4 className="font-semibold">Funding:</h4>
          <p>{project.isFunded ? `Yes - ${project.fundDetails}` : "No"}</p>
        </div>
        <div className="mb-2">
          <h4 className="font-semibold">Desirable:</h4>
          <p>{project.desirable}</p>
        </div>
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
      <CardFooter>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            // Add navigation to profile
            console.log("Navigate to profile:", project.student?.id);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </CardFooter>
    </>
  );

  const renderIndustryCard = () => (
    <>
      <CardContent className="flex-grow">
        <div className="mb-2">
          <p>{project.content}</p>
        </div>
        <div className="mb-4">
          <Badge variant="outline" className="mr-2">
            Status: {project.status}
          </Badge>
        </div>
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
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            // Add navigation to profile
            console.log("Navigate to profile:", project.business?.id);
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        {userRole === "business" && (
          <Button
            onClick={() => onApply(project)}
            className="flex-1 bg-[#eb5e17] hover:bg-[#472014] text-white"
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold">{project.topic}</CardTitle>
            <Badge className="bg-[#eb5e17] text-white">
              {project.category.replace(/_/g, " ")}
            </Badge>
          </div>
          <CardDescription className="mt-2">
            {project.type === ProjectType.PROFESSOR_PROJECT && project.professor?.department}
            {project.type === ProjectType.STUDENT_PROPOSAL && project.student?.major}
            {project.type === ProjectType.BUSINESS_PROJECT && project.business?.companyName}
          </CardDescription>
        </CardHeader>

        {project.type === ProjectType.PROFESSOR_PROJECT && renderProfessorCollaborationCard()}
        {project.type === ProjectType.STUDENT_PROPOSAL && renderStudentCard()}
        {project.type === ProjectType.BUSINESS_PROJECT && renderIndustryCard()}
      </Card>
    </motion.div>
  );
};

interface ApplyModalProps {
  show: boolean;
  onClose: () => void;
  project: Project;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ show, onClose, project }) => {
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("applicantId", localStorage.getItem("userId") || "");
      formData.append("applicantType", localStorage.getItem("role") || "");
      formData.append("name", localStorage.getItem("fullName") || "");
      formData.append("email", localStorage.getItem("email") || "");
      formData.append("phoneNumber", localStorage.getItem("phoneNumber") || "");
      formData.append("description", data.description);

      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file as File);
        });
      }

      await axios.post(`${API_URL}/project/${project.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={`Apply for ${project.topic}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Why are you interested in this project? Describe your relevant experience..."
              {...register("description", { required: true })}
              className="w-full min-h-[150px]"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Upload supporting documents (Optional)
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              {...register("images")}
              className="w-full"
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

export default ProjectsPage;
