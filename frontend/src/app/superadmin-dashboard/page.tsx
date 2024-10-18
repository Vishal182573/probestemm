"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  Briefcase,
  Video,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { API_URL } from "@/constants";

interface DashboardItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface Webinar {
  id: string;
  title: string;
  topic: string;
  requester: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  date: string;
  time: string;
  place: "ONLINE" | "OFFLINE" | "HYBRID";
  maxAttendees: number;
  duration: number;
}

interface Professor {
  id: string;
  name: string;
  degrees: string;
  department: string;
}

const dashboardItems: DashboardItem[] = [
  { id: "professors", name: "Professors", icon: <Users />, count: 150 },
  { id: "students", name: "Students", icon: <GraduationCap />, count: 5000 },
  { id: "businesses", name: "Businesses", icon: <Briefcase />, count: 75 },
  { id: "webinars", name: "Webinars", icon: <Video />, count: 30 },
  { id: "courses", name: "Courses", icon: <BookOpen />, count: 50 },
];

const initialProfessors: Professor[] = [
  {
    id: "p1",
    name: "Dr. Jane Smith",
    degrees: "Ph.D., M.Sc.",
    department: "Computer Science",
  },
  {
    id: "p2",
    name: "Prof. John Doe",
    degrees: "Ph.D., MBA",
    department: "Business Administration",
  },
];

const SuperAdminDashboard: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [professors, setProfessors] = useState<Professor[]>(initialProfessors);
  const [newProfessor, setNewProfessor] = useState<Omit<Professor, "id">>({
    name: "",
    degrees: "",
    department: "",
  });
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expandedSection === "webinars") {
      fetchWebinars();
    }
  }, [expandedSection]);

  const fetchWebinars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/webinars`);
      setWebinars(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch webinars");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleWebinarStatusUpdate = async (
    webinarId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      await axios.put(`${API_URL}/webinars/${webinarId}/status`, {
        status: newStatus,
      });
      setWebinars(
        webinars.map((w) =>
          w.id === webinarId ? { ...w, status: newStatus } : w
        )
      );
    } catch (err) {
      setError(`Failed to update webinar status`);
      console.error(err);
    }
  };

  const renderWebinarsTable = (webinars: Webinar[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Max Attendees</TableHead>
          <TableHead>Duration (min)</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webinars.map((webinar) => (
          <TableRow key={webinar.id}>
            <TableCell>{webinar.title}</TableCell>
            <TableCell>{webinar.requester}</TableCell>
            <TableCell>{renderStatusBadge(webinar.status)}</TableCell>
            <TableCell>{webinar.date}</TableCell>
            <TableCell>{webinar.time}</TableCell>
            <TableCell>{webinar.place}</TableCell>
            <TableCell>{webinar.maxAttendees}</TableCell>
            <TableCell>{webinar.duration}</TableCell>
            <TableCell>
              {webinar.status === "PENDING" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-100 text-green-800"
                    onClick={() =>
                      handleWebinarStatusUpdate(webinar.id, "APPROVED")
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-100 text-red-800"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfessor((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProfessor = () => {
    const id = `p${professors.length + 1}`;
    setProfessors((prev) => [...prev, { ...newProfessor, id }]);
    setNewProfessor({ name: "", degrees: "", department: "" });
  };

  const renderProfessorsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Professor</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newProfessor.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="degrees">Degrees</Label>
              <Input
                id="degrees"
                name="degrees"
                value={newProfessor.degrees}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={newProfessor.department}
                onChange={handleInputChange}
              />
            </div>
            <Button type="button" onClick={handleCreateProfessor}>
              <Plus className="h-4 w-4 mr-2" /> Create Professor
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Professors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Degrees</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professors.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>{professor.name}</TableCell>
                  <TableCell>{professor.degrees}</TableCell>
                  <TableCell>{professor.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-100 min-h-screen"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {dashboardItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="cursor-pointer"
              onClick={() => toggleSection(item.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {item.name}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
                {expandedSection === item.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {
                    dashboardItems.find((item) => item.id === expandedSection)
                      ?.name
                  }{" "}
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expandedSection === "professors" ? (
                  renderProfessorsSection()
                ) : expandedSection === "webinars" ? (
                  isLoading ? (
                    <p>Loading webinars...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <Tabs defaultValue="PENDING">
                      <TabsList>
                        <TabsTrigger value="PENDING">Pending</TabsTrigger>
                        <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                        <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                        <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
                        <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
                      </TabsList>
                      {(
                        [
                          "PENDING",
                          "APPROVED",
                          "REJECTED",
                          "COMPLETED",
                          "CANCELLED",
                        ] as const
                      ).map((status) => (
                        <TabsContent key={status} value={status}>
                          {renderWebinarsTable(
                            webinars.filter((w) => w.status === status)
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  )
                ) : (
                  <p>Detailed information for {expandedSection} goes here.</p>
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
