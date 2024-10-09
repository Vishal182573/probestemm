"use client"
import React, { useState } from "react";
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

interface DashboardItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface RequestItem {
  id: string;
  title: string;
  requester: string;
  status: "pending" | "approved" | "rejected";
  date: string;
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

const webinarRequests: RequestItem[] = [
  { id: "w1", title: "AI in Healthcare", requester: "Dr. Jane Smith", status: "pending", date: "2024-09-20" },
  { id: "w2", title: "Blockchain Fundamentals", requester: "Prof. John Doe", status: "approved", date: "2024-09-25" },
  { id: "w3", title: "Quantum Computing", requester: "Dr. Alice Johnson", status: "rejected", date: "2024-09-18" },
];

const courseRequests: RequestItem[] = [
  { id: "c1", title: "Machine Learning 101", requester: "Prof. Robert Brown", status: "pending", date: "2024-10-01" },
  { id: "c2", title: "Data Structures", requester: "Dr. Emily White", status: "approved", date: "2024-10-05" },
  { id: "c3", title: "Cybersecurity Basics", requester: "Prof. Michael Green", status: "rejected", date: "2024-09-28" },
];

const initialProfessors: Professor[] = [
  { id: "p1", name: "Dr. Jane Smith", degrees: "Ph.D., M.Sc.", department: "Computer Science" },
  { id: "p2", name: "Prof. John Doe", degrees: "Ph.D., MBA", department: "Business Administration" },
];

const SuperAdminDashboard: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [professors, setProfessors] = useState<Professor[]>(initialProfessors);
  const [newProfessor, setNewProfessor] = useState<Omit<Professor, "id">>({ name: "", degrees: "", department: "" });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const renderRequestsTable = (requests: RequestItem[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.title}</TableCell>
            <TableCell>{request.requester}</TableCell>
            <TableCell>{renderStatusBadge(request.status)}</TableCell>
            <TableCell>{request.date}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-red-100 text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfessor(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateProfessor = () => {
    const id = `p${professors.length + 1}`;
    setProfessors(prev => [...prev, { ...newProfessor, id }]);
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
              <Input id="name" name="name" value={newProfessor.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="degrees">Degrees</Label>
              <Input id="degrees" name="degrees" value={newProfessor.degrees} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" value={newProfessor.department} onChange={handleInputChange} />
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
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {dashboardItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="cursor-pointer" onClick={() => toggleSection(item.id)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
                {expandedSection === item.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
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
                <CardTitle>{dashboardItems.find(item => item.id === expandedSection)?.name} Details</CardTitle>
              </CardHeader>
              <CardContent>
                {expandedSection === "professors" ? (
                  renderProfessorsSection()
                ) : expandedSection === "webinars" || expandedSection === "courses" ? (
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending">
                      {renderRequestsTable(expandedSection === "webinars" ? webinarRequests.filter(r => r.status === "pending") : courseRequests.filter(r => r.status === "pending"))}
                    </TabsContent>
                    <TabsContent value="approved">
                      {renderRequestsTable(expandedSection === "webinars" ? webinarRequests.filter(r => r.status === "approved") : courseRequests.filter(r => r.status === "approved"))}
                    </TabsContent>
                    <TabsContent value="rejected">
                      {renderRequestsTable(expandedSection === "webinars" ? webinarRequests.filter(r => r.status === "rejected") : courseRequests.filter(r => r.status === "rejected"))}
                    </TabsContent>
                  </Tabs>
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