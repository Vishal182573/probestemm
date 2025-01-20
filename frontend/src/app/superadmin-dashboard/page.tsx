"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  Briefcase,
  Video,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { API_URL } from "@/constants";

// Type Definitions
// Defines the structure for Professor data including personal and academic information
type Professor = {
  id: string;
  fullName: string;
  title: string;
  university: string;
  department: string;
  isApproved: boolean;
  researchInterests: Array<{
    title: string;
    description: string;
    imageUrl: string;
  }>;
  tags: Array<{
    category: string;
    subcategory: string;
  }>;
};

// Defines the structure for Webinar data including event details and status
type Webinar = {
  id: string;
  title: string;
  professor: Professor;
  professorId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  date: string;
  place: string;
  isOnline: boolean;
};

// Defines the structure for dashboard items shown in the grid
type DashboardItem = {
  id: "professor" | "student" | "business" | "webinar";
  name: string;
  icon: JSX.Element;
  count: number;
};

const SuperAdminDashboard = () => {
  // State Management
  // Controls which section (professor/student/business/webinar) is currently expanded
  const [expandedSection, setExpandedSection] = useState<DashboardItem["id"] | null>(null);
  
  // Stores the list of professors fetched from the API
  const [professors, setProfessors] = useState<Professor[]>([]);
  
  // Stores the list of webinars fetched from the API
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state for API calls
  const [error, setError] = useState<string | null>(null);
  
  // Stores the counts for each dashboard item
  const [dashboardCounts, setDashboardCounts] = useState({
    professor: 0,
    student: 0,
    business: 0,
    webinar: 0,
  });

  // Dashboard Configuration
  // Defines the items shown in the dashboard grid with their respective icons and counts
  const dashboardItems: DashboardItem[] = [
    {
      id: "professor",
      name: "Professors",
      icon: <Users className="text-[#472014]" />,
      count: dashboardCounts.professor,
    },
    {
      id: "student",
      name: "Students",
      icon: <GraduationCap className="text-[#472014]" />,
      count: dashboardCounts.student,
    },
    {
      id: "business",
      name: "Businesses",
      icon: <Briefcase className="text-[#472014]" />,
      count: dashboardCounts.business,
    },
    {
      id: "webinar",
      name: "Webinars",
      icon: <Video className="text-[#472014]" />,
      count: dashboardCounts.webinar,
    },
  ];

  // API Functions
  // Fetches the counts for all dashboard items
  const fetchDashboardCounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/counts`);
      setDashboardCounts(response.data);
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  // Updates the status of a webinar (Approve/Reject)
  const handleWebinarStatusUpdate = async (
    webinarId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/webinars/${webinarId}/status`, { status });
      await fetchData("webinar");
      await fetchDashboardCounts();
    } catch (error) {
      console.error("Error updating webinar status:", error);
      setError("Failed to update webinar status");
    } finally {
      setIsLoading(false);
    }
  };

  // Approves a professor's account
  const handleProfessorApproval = async (professorId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.put(`${API_URL}/professors/${professorId}/approval-status`);

      // Update the professors list to reflect the change
      setProfessors((prevProfessors) =>
        prevProfessors.map((prof) =>
          prof.id === professorId ? { ...prof, isApproved: true } : prof
        )
      );

      await fetchDashboardCounts();
    } catch (error) {
      console.error("Error approving professor:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to approve professor");
      } else {
        setError("Failed to approve professor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect Hooks
  // Fetches dashboard counts on component mount
  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  // Fetches data when a section is expanded
  useEffect(() => {
    if (expandedSection) {
      fetchData(expandedSection);
    }
  }, [expandedSection]);

  // Data Fetching
  // Fetches data for the selected section (professors or webinars)
  const fetchData = async (section: DashboardItem["id"]) => {
    setIsLoading(true);
    setError(null);
    try {
      switch (section) {
        case "professor":
          const profResponse = await axios.get(`${API_URL}/professors`);
          setProfessors(profResponse.data);
          break;
        case "webinar":
          const webinarResponse = await axios.get(`${API_URL}/webinars`);
          setWebinars(webinarResponse.data);
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${section}s`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // UI Helper Functions
  // Toggles the expanded/collapsed state of a section
  const toggleSection = (section: DashboardItem["id"]) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Renders a status badge with appropriate styling
  const renderStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-yellow-300 text-yellow-800",
      APPROVED: "bg-green-300 text-green-800",
      REJECTED: "bg-red-300 text-red-800",
      COMPLETED: "bg-blue-300 text-blue-800",
      CANCELLED: "bg-gray-300 text-gray-800",
    };

    return (
      <Badge
        variant="outline"
        className={`px-2 py-1 rounded-full font-medium ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  // Section Rendering Functions
  // Renders the professor management section
  const renderProfessorSection = () => (
    <div className="grid grid-cols-1 gap-4">
      {professors.map((professor) => (
        <Card
          key={professor.id}
          className="mb-4 border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-[#c1502e]">
                <AvatarFallback className="bg-[#472014] text-white">
                  {professor.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-[#472014]">
                  {professor.fullName}
                </h3>
                <p className="text-[#686256]">{professor.department}</p>
                <p className="text-[#686256]">{professor.university}</p>
                <div className="flex gap-2 mt-2">
                  {professor.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.category}: {tag.subcategory}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {!professor.isApproved && (
              <Button
                onClick={() => handleProfessorApproval(professor.id)}
                className="bg-green-300 text-green-800 hover:bg-green-400"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Professor
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Renders the webinar management section
  const renderWebinarSection = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#472014]">Title</TableHead>
          <TableHead className="text-[#472014]">Professor</TableHead>
          <TableHead className="text-[#472014]">Status</TableHead>
          <TableHead className="text-[#472014]">Date</TableHead>
          <TableHead className="text-[#472014]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webinars.map((webinar) => (
          <TableRow key={webinar.id}>
            <TableCell className="text-[#472014]">{webinar.title}</TableCell>
            <TableCell className="text-[#472014]">
              {webinar.professor?.fullName}
            </TableCell>
            <TableCell className="text-[#472014]">
              {renderStatusBadge(webinar.status)}
            </TableCell>
            <TableCell className="text-[#472014]">
              {new Date(webinar.date).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-[#472014]">
              {webinar.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-300 text-green-800 hover:bg-green-400"
                    onClick={() =>
                      handleWebinarStatusUpdate(webinar.id, "APPROVED")
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-300 text-red-800 hover:bg-red-400"
                    onClick={() =>
                      handleWebinarStatusUpdate(webinar.id, "REJECTED")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Main section renderer that determines which section to display
  const renderSection = (section: DashboardItem["id"]) => {
    switch (section) {
      case "professor":
        return renderProfessorSection();
      case "webinar":
        return renderWebinarSection();
      default:
        return <p>Section not implemented yet</p>;
    }
  };

  // Main Component Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-[#472014]">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer border-2 border-[#c1502e]/20"
              onClick={() => toggleSection(item.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-[#472014]">
                  {item.name}
                </CardTitle>
                <div className="text-[#472014]">{item.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#472014]">
                  {item.count}
                </div>
                {expandedSection === item.id ? (
                  <ChevronUp className="h-4 w-4 text-[#c1502e]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#c1502e]" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {expandedSection && (
          <motion.div
            key={expandedSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="mb-8 border-2 border-[#c1502e]/20 bg-white">
              <CardHeader>
                <CardTitle className="text-[#472014] font-caveat text-2xl">
                  {
                    dashboardItems.find((item) => item.id === expandedSection)
                      ?.name
                  }{" "}
                  Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <p className="text-[#472014]">Loading...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 p-4">{error}</div>
                ) : (
                  renderSection(expandedSection)
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuperAdminDashboard;
