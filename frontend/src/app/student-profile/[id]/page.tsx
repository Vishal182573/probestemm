"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion} from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Briefcase, GraduationCap, Star, Edit3 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

import { API_URL } from "@/constants";

interface Student {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  imageUrl: string | null;
  university: string;
  course: string;
  researchHighlights: Array<{ id: string; title: string; status: string }>;
  experience: string;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    passingYear: string;
  }>;
  achievements: Array<{ id: string; year: string; description: string }>;
}

const StudentProfilePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/student/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="text-center flex items-center justify-center h-screen bg-white">
        <div className="loader text-[#c1502e] font-caveat text-2xl">Loading...</div>
        <div className="text-[#472014] ml-2">please wait</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-[#c1502e] text-center p-4">{error}</div>;
  }

  if (!student) {
    return <div className="text-[#472014] text-center p-4">Student not found</div>;
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#472014]">
      <Navbar />

      <main className="flex-grow">
        <motion.section
          className="relative bg-gradient-to-b from-[#c1502e] to-[#686256] text-white py-24"
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
                  <Avatar className="w-32 h-32 border-4 border-white">
                    <AvatarImage src={student.imageUrl || ""} alt={student.fullName} />
                    <AvatarFallback className="bg-[#472014] text-white">
                      {student.fullName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-extrabold mb-2 font-caveat">{student.fullName}</h1>
                  <p className="text-xl font-bold">{student.course}</p>
                  <p className="text-lg">{student.university}</p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#c1502e] font-bold transition-all duration-300"
                >
                  <Edit3 className="mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <Card className="border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#c1502e] font-caveat">
                    <Star className="mr-2" />
                    Research Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-2">
                    {student.researchHighlights.map((highlight) => (
                      <li key={highlight.id} className="flex items-center">
                        <Badge 
                          variant="secondary" 
                          className="mr-2 bg-[#c1502e]/10 text-[#c1502e] font-semibold"
                        >
                          {highlight.status}
                        </Badge>
                        <span className="font-medium">{highlight.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#c1502e] font-caveat">
                    <Briefcase className="mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014] font-medium">
                  <p>{student.experience}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#c1502e] font-caveat">
                    <GraduationCap className="mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-4">
                    {student.education.map((edu) => (
                      <li key={edu.id}>
                        <h3 className="font-bold text-[#472014]">{edu.degree}</h3>
                        <p className="text-sm text-[#686256] font-medium">
                          {edu.institution}
                        </p>
                        <p className="text-sm text-[#686256] font-medium">
                          Passing Year: {edu.passingYear}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#c1502e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-extrabold text-[#c1502e] font-caveat">
                    <Award className="mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[#472014]">
                  <ul className="space-y-2">
                    {student.achievements.map((achievement) => (
                      <li key={achievement.id} className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className="mr-2 border-[#c1502e] text-[#c1502e] font-semibold"
                        >
                          {achievement.year}
                        </Badge>
                        <span className="font-medium">{achievement.description}</span>
                      </li>
                    ))}
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