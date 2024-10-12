"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Briefcase,
  ExternalLink,
  Globe,
  GraduationCap,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useParams } from "next/navigation";

const ProfessorProfilePage: React.FC = () => {
  const {id} = useParams();
  const [isWebinarDialogOpen, setIsWebinarDialogOpen] = useState(false);

  const tabItems = [
    { id: "profile", label: "My Profile", icon: <GraduationCap /> },
    { id: "projects", label: "My Projects", icon: <Briefcase /> },
    { id: "webinars", label: "My Webinars", icon: <Video /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          className="relative bg-secondary text-secondary-foreground py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src="/professor.png" alt="Dr. Lorem Ipsum" />
                  <AvatarFallback>LI</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Dr. Lorem Ipsum, Ph.D.
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Distinguished Professor of Computer Science
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Prestigious University
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </Button>
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google Scholar
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Profile Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="flex justify-center bg-background p-2 rounded-lg">
                {tabItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex items-center space-x-2 px-4 py-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <Award className="mr-2" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2023
                          </Badge>
                          Outstanding Researcher Award
                        </li>
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2022
                          </Badge>
                          Best Paper Award at AI Conference
                        </li>
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2021
                          </Badge>
                          National Science Foundation Grant
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <Briefcase className="mr-2" />
                        Positions Held
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2020 - Present
                          </Badge>
                          Distinguished Professor, Prestigious University
                        </li>
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2015 - 2020
                          </Badge>
                          Associate Professor, Another University
                        </li>
                        <li className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            2010 - 2015
                          </Badge>
                          Assistant Professor, Yet Another University
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="projects">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <Briefcase className="mr-2" />
                        My Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Upcoming Projects
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>AI for Climate Change Mitigation</span>
                              <Badge>Tech Corp, Starting Sept 2024</Badge>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Ongoing Projects
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Quantum Computing Applications</span>
                              <Badge variant="secondary">
                                QuantumTech, Since Jan 2024
                              </Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Neural Networks for Medical Imaging</span>
                              <Badge variant="secondary">
                                MedTech Inc, Since Aug 2023
                              </Badge>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Completed Projects
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Blockchain for Supply Chain</span>
                              <Badge variant="outline">
                                LogiCorp, Completed Dec 2023
                              </Badge>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="webinars">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl font-bold text-primary">
                        <Video className="mr-2" />
                        My Webinars
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-end">
                          <Dialog
                            open={isWebinarDialogOpen}
                            onOpenChange={setIsWebinarDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button>Create Webinar</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Create a New Webinar</DialogTitle>
                              </DialogHeader>
                              <form className="space-y-4">
                                <div>
                                  <Label htmlFor="webinar-title">
                                    Webinar Title
                                  </Label>
                                  <Input
                                    id="webinar-title"
                                    placeholder="Enter webinar title"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="webinar-topic">Topic</Label>
                                  <Input
                                    id="webinar-topic"
                                    placeholder="Enter webinar topic"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="webinar-place">Place</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a place" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="online">
                                        Online
                                      </SelectItem>
                                      <SelectItem value="in-person">
                                        In-person
                                      </SelectItem>
                                      <SelectItem value="hybrid">
                                        Hybrid
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="webinar-date">Date</Label>
                                  <Input id="webinar-date" type="date" />
                                </div>
                                <Button type="submit">
                                  Submit for Approval
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Upcoming Webinars
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Future of AI in Healthcare</span>
                              <Badge>Oct 15, 2024</Badge>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Completed Webinars
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>Introduction to Quantum Computing</span>
                              <Badge variant="secondary">Mar 5, 2024</Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Ethical Considerations in AI</span>
                              <Badge variant="secondary">Jan 20, 2024</Badge>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            Pending Approval
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span>
                                Blockchain Technology: Beyond Cryptocurrencies
                              </span>
                              <Badge variant="outline">
                                Awaiting Admin Approval
                              </Badge>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default ProfessorProfilePage;
