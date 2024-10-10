"use client";
import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase, GraduationCap, Star, Edit3 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { LogoutButton } from "@/components/shared/LoginForm";

const StudentProfilePage: React.FC = () => {
  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage
                      src="/student-banner.png"
                      alt="Mr. Lorem Ipsum"
                    />
                    <AvatarFallback>LI</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Mr. Lorem Ipsum</h1>
                  <p className="text-xl text-muted-foreground">
                    Computer Science (B.Sc.)
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Innovative Tech University
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full">
                    <Edit3 className="mr-2" />
                    Edit Profile
                  </Button>
                  <LogoutButton />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Profile Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Star className="mr-2" />
                    Research Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        Ongoing
                      </Badge>
                      Machine Learning in Healthcare
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        Completed
                      </Badge>
                      Blockchain for Supply Chain Management
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Briefcase className="mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li>
                      <h3 className="font-semibold">Research Assistant</h3>
                      <p className="text-sm text-muted-foreground">
                        AI Lab, Innovative Tech University
                      </p>
                      <p className="text-sm text-muted-foreground">
                        June 2023 - Present
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold">Summer Intern</h3>
                      <p className="text-sm text-muted-foreground">
                        Tech Innovations Inc.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Summer 2022
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <GraduationCap className="mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li>
                      <h3 className="font-semibold">
                        B.Sc. in Computer Science
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Innovative Tech University
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2021 - Present
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold">High School Diploma</h3>
                      <p className="text-sm text-muted-foreground">
                        Tech Preparatory School
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Graduated 2021
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>

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
                      Dean List, Spring Semester
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        2022
                      </Badge>
                      1st Place, University Hackathon
                    </li>
                    <li className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        2021
                      </Badge>
                      Merit Scholarship Recipient
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfilePage;
