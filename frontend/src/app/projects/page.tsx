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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket,
  GraduationCap,
  UserCircle,
  User2Icon,
  XCircle,
} from "lucide-react";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { PROJECT } from "../../../public";
import { useRouter } from "next/navigation";

// Enum types
enum ProjectType {
  BUSINESS_PROJECT = "BUSINESS_PROJECT",
  PROFESSOR_PROJECT = "PROFESSOR_PROJECT", 
  STUDENT_PROPOSAL = "STUDENT_PROPOSAL"
}

enum ProposalCategory {
  PROJECT = "PROJECT",
  INTERNSHIP = "INTERNSHIP",
  PHD_POSITION = "PHD_POSITION",
  PROFESSOR_COLLABORATION = "PROFESSOR_COLLABORATION",
  STUDENT_OPPORTUNITY = "STUDENT_OPPORTUNITY", 
  INDUSTRY_COLLABORATION = "INDUSTRY_COLLABORATION",
  TECHNOLOGY_SOLUTION = "TECHNOLOGY_SOLUTION",
  RND_PROJECT = "RND_PROJECT"
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
  };
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
    companyName: string 
  };
  student?: {
    id: string;
    fullName: string;
    major?: string;
  };
  postedBy?: {
    role: 'PROFESSOR' | 'STUDENT' | 'BUSINESS';
    name: string;
  }
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Filtering states
  const [activeTab, setActiveTab] = useState<string>("students");
  const [projectsFor, setProjectsFor] = useState<string | null>(null);
  const [projectSubCategory, setProjectSubCategory] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });

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

  // Advanced filtering logic
  useEffect(() => {
    let result = projects;

    // Tab-based filtering
    switch(activeTab) {
      case "students":
        result = result.filter(p => 
          p.type === ProjectType.PROFESSOR_PROJECT || 
          p.type === ProjectType.BUSINESS_PROJECT ||
          p.type === ProjectType.STUDENT_PROPOSAL
        );
        break;
      case "professors":
        result = result.filter(p => 
          p.type === ProjectType.PROFESSOR_PROJECT ||
          p.type === ProjectType.STUDENT_PROPOSAL
        );
        break;
      case "industry":
        result = result.filter(p => 
          p.type === ProjectType.BUSINESS_PROJECT ||
          p.type === ProjectType.STUDENT_PROPOSAL
        );
        break;
    }

    // Projects For filtering
    if (projectsFor) {
      switch(projectsFor) {
        case "students":
          result = result.filter(p => 
            [ProposalCategory.INTERNSHIP, ProposalCategory.PHD_POSITION, 
             ProposalCategory.STUDENT_OPPORTUNITY].includes(p.category)
          );
          break;
        case "professors":
          result = result.filter(p => 
            [ProposalCategory.PROFESSOR_COLLABORATION, 
             ProposalCategory.RND_PROJECT].includes(p.category)
          );
          break;
        case "industry":
          result = result.filter(p => 
            [ProposalCategory.TECHNOLOGY_SOLUTION, 
             ProposalCategory.INDUSTRY_COLLABORATION].includes(p.category)
          );
          break;
      }
    }

    // Subcategory filtering
    if (projectSubCategory) {
      result = result.filter(p => p.category === projectSubCategory);
    }

    setFilteredProjects(result);
  }, [activeTab, projectsFor, projectSubCategory, projects]);

  // Dynamic dropdowns render logic (similar to previous implementation)
  const renderProjectsForDropdown = () => {
    if (activeTab === "professors") {
      return (
        <Select 
          onValueChange={(value) => setProjectsFor(value)}
          value={projectsFor || undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Projects for..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="students">Students</SelectItem>
            <SelectItem value="industry">Industry</SelectItem>
            <SelectItem value="professors">Professors</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    // Similar dropdown logic for other tabs
    return null;
  };

  const renderSubCategoryDropdown = () => {
    // Dropdown logic based on tab and projects for selection
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-[#472014] font-caveat text-2xl">
          <Rocket className="h-8 w-8 r-2 mr-2 text-[#eb5e17]" />
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
            defaultValue="students" 
            onValueChange={(value) => {
              setActiveTab(value);
              setProjectsFor(null);
              setProjectSubCategory(null);
            }}
          >
            <TabsList className="mb-8">
              <TabsTrigger value="students">
                <GraduationCap className="mr-2 h-5 w-5" />
                Students Projects
              </TabsTrigger>
              <TabsTrigger value="professors">
                <UserCircle className="mr-2 h-5 w-5" />
                Professors Projects
              </TabsTrigger>
              <TabsTrigger value="industry">
                <UserCircle className="mr-2 h-5 w-5" />
                Industry Projects
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-4 mb-8">
              {renderProjectsForDropdown()}
              {renderSubCategoryDropdown()}
            </div>

            <ProjectsList 
              projects={filteredProjects} 
              activeTab={activeTab}
            />
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ProjectsList = ({
  projects,
  activeTab,
}: {
  projects: Project[];
  activeTab: string;
}) => {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            activeTab={activeTab}
          />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  activeTab,
}: {
  project: Project;
  index: number;
  activeTab: string;
}) => {
  const router = useRouter();

  const renderProjectDetails = () => {
    switch (project.category) {
      case ProposalCategory.INTERNSHIP:
        return (
          <>
            <div>
              <h4 className="font-semibold">Eligibility:</h4>
              <p>{project.eligibility || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Duration:</h4>
              <p>{project.duration ? `${project.duration.startDate} to ${project.duration.endDate}` : 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Funding:</h4>
              <p>{project.isFunded ? `Yes: ${project.fundDetails}` : 'Unpaid'}</p>
            </div>
          </>
        );
      case ProposalCategory.PHD_POSITION:
        return (
          <>
            <div>
              <h4 className="font-semibold">Research Description:</h4>
              <p>{project.techDescription || 'No description'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Requirements:</h4>
              <p>{project.requirements || 'No specific requirements'}</p>
            </div>
          </>
        );
      case ProposalCategory.RND_PROJECT:
        return (
          <>
            <div>
              <h4 className="font-semibold">Technology Description:</h4>
              <p>{project.techDescription || 'No description'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Collaboration Objectives:</h4>
              <p>{project.requirements || 'Not specified'}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderContactInfo = () => {
    if (project.professor) {
      return (
        <div>
          <p>{project.professor.fullName}</p>
          <p>{project.professor.department}</p>
        </div>
      );
    }
    if (project.business) {
      return (
        <div>
          <p>{project.business.companyName}</p>
        </div>
      );
    }
    if (project.student) {
      return (
        <div>
          <p>{project.student.fullName}</p>
          <p>{project.student.major}</p>
        </div>
      );
    }
    return <p>No contact information</p>;
  };

  const renderPostedByTag = () => {
    if (project.postedBy) {
      return (
        <Badge 
          className={`
            ${project.postedBy.role === 'PROFESSOR' ? 'bg-blue-500' : 
              project.postedBy.role === 'STUDENT' ? 'bg-green-500' : 
              'bg-purple-500'} text-white
          `}
        >
          Posted by {project.postedBy.role}
        </Badge>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{project.topic}</CardTitle>
            {renderPostedByTag()}
          </div>
          <CardDescription>{project.content}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderProjectDetails()}
          <div className="mt-4">
            <h4 className="font-semibold">Contact:</h4>
            {renderContactInfo()}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="default">View Details</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectsPage;