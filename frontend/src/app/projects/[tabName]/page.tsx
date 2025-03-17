// page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Footer } from "@/components/shared/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket,
  GraduationCap,
  UserCircle,
  Building,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { PROJECT } from "../../../../public";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import { ProjectsList } from "@/components/Projects/ProjectList";
import { ApplyModal } from "@/components/Projects/ApplyModal";

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

// Main component for the Projects page
const ProjectsPage: React.FC = () => {
  // State management for projects and UI controls
  const [projects, setProjects] = useState<Project[]>([]); // Stores all projects
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]); // Stores filtered projects
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [, setError] = useState<string | null>(null); // Error state management
  const [activeCategory, setActiveCategory] = useState<ProposalCategory | null>(null); // Currently selected category
  const [showModal, setShowModal] = useState(false); // Controls application modal visibility
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Currently selected project
  const [appliedProjects, setAppliedProjects] = useState<Set<string>>(new Set());
  const [tempSearch, setTempSearch] = useState(''); // Temporary search query state

  // Navigation and routing hooks
  const params = useParams();
  const router = useRouter();
  
  // Function to determine initial tab based on URL parameters
  const getInitialTab = () => {
    // If no params, return null to trigger default tab
    if (!params || !params.tabName) {
      return 'professors'; // Default to professors
    }
  
    const tabName = (params.tabName as string).toLowerCase();
    
    // Validate and normalize tab name
    switch (tabName) {
      case 'professors':
      case 'professor':
        return 'professors';
      case 'industry':
      case 'industries':
      case 'business':
      case 'businesses':
        return 'industry';
      case 'students':
      case 'student':
        return 'students';
      default:
        // If an invalid tab is specified, redirect to professors
        router.replace('/projects/professors');
        return 'professors';
    }
  };
            
  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  // Effect hook to fetch projects when tab or category changes
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
        console.log(response.data);
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

  // Effect hook to filter projects based on search query
  const [searchQuery, setSearchQuery] = useState('');
  // for category filter
  const [selectedCategory, setSelectedCategory] = useState('all'); // Currently selected category
  const [selectedOpportunity, setSelectedOpportunity] = useState('all');
  
  const filterProjects = () => {
    let filtered = projects;
  
    // Filter by category
    if (selectedCategory !== 'all') {
      if(activeTab === 'professors') {
        if (selectedCategory === 'students') {
          filtered = filtered.filter(project => 
            ['RND_PROJECT', 'INTERNSHIP', 'PHD_POSITION'].includes(project.category)
          );
        } else {
          filtered = filtered.filter(project => project.category === selectedCategory);
        }
      }
      else if(activeTab === 'industry') {
        if (selectedCategory === 'PROFESSOR_COLLABORATION') {
          filtered = filtered.filter(project => project.category === "RND_PROJECT");
        } else {
          filtered = filtered.filter(project => project.category === "INTERNSHIP");
        }
      }
      else if(activeTab === 'students') {
        if(selectedCategory === 'PROFESSOR_COLLABORATION') {
          filtered = filtered.filter(project => project.proposalFor === "Professor");
        }
        else {
          filtered = filtered.filter(project => project.proposalFor === "Industry");
        }
      }
    }
  
    // Filter by opportunity type
    if (selectedCategory === 'students' && activeTab === 'professors') {
      if (selectedOpportunity !== 'all') {
        filtered = filtered.filter(project => project.category === selectedOpportunity);
      }
    }
    if(activeTab === 'students' && selectedOpportunity !== 'all') {
      filtered = filtered.filter(project => project.content === selectedOpportunity);
    }
  
    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(',').map(term => term.trim());
      
      filtered = filtered.filter(project => 
        searchTerms.some(term => 
          project.tags.some(tag => 
            tag.toLowerCase().includes(term)
          )
        )
      );
    }
  
    setFilteredProjects(filtered);
  };

  // Combined filtering effect
  useEffect(() => {
    filterProjects();
  }, [searchQuery, selectedCategory, filterProjects]);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, selectedCategory, selectedOpportunity, filterProjects]);

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

  // Loading state UI
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

  // Main component render
  return (
    <div className="flex flex-col min-h-screen  text-[#472014]">
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
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setSelectedCategory('all');
              setSelectedOpportunity('all');
              setActiveCategory(null);
            }}
          >
            <div className="text-white text-2xl mb-4 font-medium ">Research Positions/Projects floated by </div>
            <TabsList className="mb-8 bg-blue-800">
              <TabsTrigger value="professors" className="text-white">
                <UserCircle className="mr-2 h-5 w-5" />
                Faculty/Scientist
              </TabsTrigger>
              <TabsTrigger value="industry" className="text-white">
                <Building className="mr-2 h-5 w-5" />
                Industry
              </TabsTrigger>
              <TabsTrigger value="students" className="text-white">
                <GraduationCap className="mr-2 h-5 w-5" />
                Student
              </TabsTrigger>
            </TabsList>

            <div className={`flex gap-10 lg:gap-20 ${activeTab === "students" ? "justify-end" : "justify-between"}`}>
              
            <div className="space-y-2 w-full">
              <label htmlFor="search" className="text-sm font-medium text-white">
                Search Projects
              </label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter tags (e.g., AI, Machine Learning)"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSearchQuery(tempSearch);
                    }
                  }}
                  className="w-full pl-8 text-white"
                />
                <button
                  type="button"
                  onClick={() => setSearchQuery(tempSearch)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="text-white h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Separate multiple tags with commas
              </p>
            </div>

              <div className="space-y-2 w-52 lg:w-72">
                <label className="text-sm font-medium text-white ml-2">
                  Collaboration type
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-52 lg:w-72 text-white h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {(activeTab !== "students") && <SelectItem value="students">Students</SelectItem>}
                    <SelectItem value="PROFESSOR_COLLABORATION">Professor</SelectItem>
                    {(activeTab !== "industry") && <SelectItem value="INDUSTRY_COLLABORATION">Industry</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              {((activeTab === 'professors' && selectedCategory === 'students') || 
              activeTab === 'students') && 
              <div className="space-y-2 w-52 lg:w-72">
                <label className="text-sm font-medium text-white ml-2">
                  Opportunity type
                </label>
                <Select value={selectedOpportunity} onValueChange={setSelectedOpportunity}>
                  <SelectTrigger className="w-52 lg:w-72 text-white h-10">
                    <SelectValue placeholder="Select opportunity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Opportunities</SelectItem>
                    {activeTab === 'students' ? (
                      <>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="PhD Position">PhD Position</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="PHD_POSITION">PhD Position</SelectItem>
                        <SelectItem value="RND_PROJECT">R&D Project</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            }

            </div>

            <ProjectsList
              projects={filteredProjects}
              onApply={openApplyModal}
              appliedProjects={appliedProjects}
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
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
