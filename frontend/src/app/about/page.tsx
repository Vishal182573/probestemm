/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Import icons for feature cards
import { FaIndustry, FaGraduationCap, FaExchangeAlt, FaBook, FaResearchgate, FaBookReader } from "react-icons/fa";
// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import shared components
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
// Import assets and Next.js components
import { ABOUT, ABOUTPAGE} from "../../../public";
import Link from "next/link";
import Image from "next/image";

// Interface definition for the CountUpAnimation component props
interface CountUpAnimationProps {
  end: number;          // Final number to count up to
  duration?: number;    // Duration of animation in milliseconds
  label?: string;       // Label to display below the number
}

// CountUpAnimation Component: Animates a number counting up from 0 to a target value
const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  end,
  duration = 2000,
  label = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: DOMHighResTimeStamp | undefined;
    const animateCount = (timestamp: DOMHighResTimeStamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const nextCount = Math.min(Math.floor((progress / duration) * end), end);
      setCount(nextCount);
      if (nextCount < end) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-[#eb5e17]">{count}</div>
      <div className="text-sm text-[#472014]">{label}</div>
    </div>
  );
};

// Stats Component: Displays a grid of animated statistics
const Stats = () => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white/90 backdrop-blur shadow-xl rounded-lg p-6 mb-12">
    <CountUpAnimation end={5000} label="Students Enrolled" />
    <CountUpAnimation end={200} label="Professors Associated" />
    <CountUpAnimation end={100} label="Industries Associated" />
    <CountUpAnimation end={500} label="Projects Completed" />
  </div>
);

// Main AboutUsPage Component
const AboutUsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Navigation bar with background */}
      <NavbarWithBg />

      {/* Hero banner section with main image and title */}
      <Banner
        imageSrc={ABOUT}
        altText="About Us Banner"
        title="Probe STEM"
        subtitle="Empowering the next generation of innovators"
      />

      {/* Main content container with animations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >
        {/* Motto Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#472014] mb-4">Our Motto</h2>
          <p className="text-xl text-[#472014]">
          Bridging the gap between academia and industry to ensure practical impacts and actionable solutions
          </p>
        </motion.div>

        {/* About Section with image */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-[#472014] mb-8 text-center">About Probe STEM</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-[#472014] text-left">
              Probe STEM is a pioneering platform dedicated to bridging the gap between academia and industry in the Science, Technology, Engineering and Mathematics fields. We believe in creating meaningful connections that transform theoretical knowledge into practical innovations.
              </p>
              <p className="text-lg text-[#472014] text-left">
                Our platform serves as a dynamic ecosystem where students, professors, and industry professionals collaborate on cutting-edge projects, share knowledge, and drive technological advancement. Through our innovative approach, we are reshaping how STEM education translates into real-world impact.
              </p>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={ABOUTPAGE}
                alt="Probe STEM Community"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Core Features Section Title */}
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-8 text-center text-[#472014] font-caveat"
        >
          Core Features
        </motion.h2>

        {/* First row of feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Industry Collaboration Card */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaIndustry className="mr-2 text-[#eb5e17]" /> Industry
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                In today's era of rapid innovation, academia and industry often operate in isolation. Bridging the gap between them could ignite a revolution, empowering researchers to make meaningful contributions by aligning their work with real-world applications. This forum aims to expand faculty and researchers' access to industry, supporting the journey from research to marketable products. Additionally, we hope it will enable industry partners to connect with expert consultants in academia, fostering collaborations that both parties seek yet often struggle to find.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Knowledge Exchange Card */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaExchangeAlt className="mr-2 text-[#eb5e17]" /> Knowledge
                  Exchange
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                In academia, students often encounter critical questions, and reliable discussions can be the key to navigating challenges and advancing their careers. Through our discussion forum, we aim to foster insightful conversations and Q&A sessions on a wide range of topics. From the administrative side, we will ensure that all discussions are accurate and trustworthy.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Second row of feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Company Projects Card */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaBook className="mr-2 text-[#eb5e17]" /> Company
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                Our primary goal is to build connections between academia and industry, enabling students and faculty to engage with industry partners. Faculty can pursue opportunities for R&D projects, consultancy, and technology solutions that align with their research expertise. Students will gain access to industrial internships and, through their professors, can participate in research projects that foster practical experience and innovation.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Research Corner Card */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaBookReader className="mr-2 text-[#eb5e17]" /> R <sup>c</sup>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                Research Corner will empower professors/researchers to present their unique findings as spotlights, offering them a platform to showcase breakthroughs and impactful discoveries. This section will also serve as a space for researchers to share announcements related to their work, including calls for a specific collaboration, upcoming events, or specialized opportunities, enhancing professional networking and community engagement.
              </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </motion.div>
      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;