"use client"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { API_URL } from "@/constants";

// Define types based on Prisma schema
type Professor = {
  id: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  department: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
};

type Student = {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string | null;
  university: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
};

type Business = {
  id: string;
  companyName: string;
  email: string;
  profileImageUrl?: string | null;
  industry: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
};

type Webinar = {
  id: string;
  title: string;
  professor: Professor;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  date: string;
  place: string;
  isOnline: boolean;
};

type DashboardItem = {
  id: "professors" | "student" | "business" | "webinars";
  name: string;
  icon: JSX.Element;
  count: number;
};

const dashboardItems: DashboardItem[] = [
  { id: "professors", name: "Professors", icon: <Users />, count: 150 },
  { id: "student", name: "Students", icon: <GraduationCap />, count: 5000 },
  { id: "business", name: "Businesses", icon: <Briefcase />, count: 75 },
  { id: "webinars", name: "Webinars", icon: <Video />, count: 30 },
];

const SuperAdminDashboard = () => {
  const [expandedSection, setExpandedSection] = useState<DashboardItem["id"] | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expandedSection) {
      fetchData(expandedSection);
    }
  }, [expandedSection]);

  const fetchData = async (section: DashboardItem["id"]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${section}`);
      switch (section) {
        case "professors":
          setProfessors(response.data);
          break;
        case "student":
          setStudents(response.data);
          break;
        case "business":
          setBusinesses(response.data);
          break;
        case "webinars":
          setWebinars(response.data);
          break;
      }
    } catch (err) {
      setError(`Failed to fetch ${section}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: DashboardItem["id"]) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant="outline" className={statusColors[status as keyof typeof statusColors]}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const renderProfileCard = (
    profile: Professor | Student | Business,
    type: "professor" | "student" | "business"
  ) => (
    <Card key={profile.id} className="mb-4 border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="flex items-center space-x-4 p-4">
        <Avatar className="w-16 h-16 border-2 border-[#c1502e]">
          <AvatarImage src={
            type === "professor" ? (profile as Professor).photoUrl :
            type === "student" ? (profile as Student).imageUrl :
            (profile as Business).profileImageUrl 
          } />
          <AvatarFallback className="bg-[#472014] text-white">
            {type === "business" 
              ? (profile as Business).companyName.split(" ").map(n => n[0]).join("")
              : (profile as (Professor | Student)).fullName.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-bold text-[#472014]">
            {type === "business" 
              ? (profile as Business).companyName
              : (profile as (Professor | Student)).fullName}
          </h3>
          <p className="text-[#686256]">
            {type === "professor" ? (profile as Professor).department :
             type === "student" ? (profile as Student).university :
             (profile as Business).industry}
          </p>
          <p className="text-[#686256] text-sm">{profile.email}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = (section: DashboardItem["id"]) => {
    if (isLoading) return <p className="text-[#472014]">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    switch (section) {
      case "professors":
      case "student":
      case "business":
        const data = section === "professors" ? professors :
                    section === "student" ? students :
                    businesses;
        
        return (
          <Tabs defaultValue="APPROVED" className="w-full">
            <TabsList className="bg-[#c1502e]/10">
              <TabsTrigger value="APPROVED">Approved</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            </TabsList>
            
            {["APPROVED", "PENDING", "REJECTED"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data
                    .filter(item => item.status === status)
                    .map(profile => renderProfileCard(
                      profile,
                      section === "professors" ? "professor" :
                      section === "student" ? "student" :
                      "business"
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        );

      case "webinars":
        return (
          <Tabs defaultValue="PENDING">
            <TabsList className="bg-[#c1502e]/10">
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="APPROVED">Approved</TabsTrigger>
              <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
              <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
            </TabsList>
            
            {["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"].map((status) => (
              <TabsContent key={status} value={status}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webinars
                      .filter(w => w.status === status)
                      .map(webinar => (
                        <TableRow key={webinar.id}>
                          <TableCell>{webinar.title}</TableCell>
                          <TableCell>{webinar.professor.fullName}</TableCell>
                          <TableCell>{renderStatusBadge(webinar.status)}</TableCell>
                          <TableCell>{new Date(webinar.date).toLocaleDateString()}</TableCell>
                          <TableCell>{webinar.isOnline ? "Online" : webinar.place}</TableCell>
                          <TableCell>
                            {webinar.status === "PENDING" && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-100 text-green-800"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-100 text-red-800"
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
              </TabsContent>
            ))}
          </Tabs>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-[#472014] font-caveat">
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
                <div className="text-[#c1502e]">{item.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#472014]">{item.count}</div>
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
          >
            <Card className="mb-8 border-2 border-[#c1502e]/20">
              <CardHeader>
                <CardTitle className="text-[#472014] font-caveat text-2xl">
                  {dashboardItems.find(item => item.id === expandedSection)?.name} Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderSection(expandedSection)}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuperAdminDashboard;