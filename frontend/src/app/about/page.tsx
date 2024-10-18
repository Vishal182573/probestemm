"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaIndustry,
  FaGraduationCap,
  FaExchangeAlt,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#c1502e] to-[#686256] min-h-screen">
      <NavbarWithBg/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-8xl lg:text-[150px] font-extrabold mb-8 text-center text-[#472014] font-caveat"
        >
          Probe STEM
        </motion.h1>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-[#472014] font-bold">About Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-[#c1502e] font-bold mb-4">
                Empowering the next generation to innovate and thrive alongside
                global researchers.
              </p>
              <p className="mb-4 text-[#472014] text-lg">
                Probe STEM is founded on the belief that young minds have the
                potential to shape the future of Science and Technology. Our
                goal is to empower students by linking them with visionary
                researchers and industry leaders for collaboration on innovative
                projects.
              </p>
              <p className="text-[#472014] text-lg">
                Faculty often face challenges in finding industry projects and
                engaging passionate students beyond the classroom settings. Our
                platform bridges that gap, offering a 3-Body collaboration to
                work on real-world challenges, share ideas, and nurture
                curiosity into transformative innovations.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-8 text-center text-[#472014] font-caveat"
        >
          Why choose Probe STEM?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaIndustry className="mr-2 text-[#c1502e]" /> Industry
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                  In today era of innovation, academics and industry often
                  work in isolation. Bridging the gap between them could spark a
                  revolution, allowing researchers to make more meaningful
                  contributions by aligning their work with real-world
                  applications.
                </p>
                <p className="mt-2 font-semibold text-[#c1502e]">
                  This will go to Company Projects page.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaExchangeAlt className="mr-2 text-[#c1502e]" /> Knowledge
                  Exchange
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                  In academics, students often face critical questions, and
                  reliable discussions can sometimes be the key to saving a
                  career. This feature facilitates insightful discussions and
                  Q&A sessions on a broad spectrum of topics.
                </p>
                <p className="mt-2 font-semibold text-[#c1502e]">
                  This will go to Discussion Board.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaLightbulb className="mr-2 text-[#c1502e]" /> Research
                  Spotlight Corner
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                  A strong visibility of fundamental research can be a
                  game-changer.
                </p>
                <p className="mt-2">
                  This feature allows researchers to showcase their work and get
                  feedback from the community. It also provides a platform for
                  students to explore research opportunities and connect with
                  potential mentors.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                <FaGraduationCap className="mr-2 text-[#c1502e]" /> Company
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#472014] text-lg">
              <p>
                Only faculty members are eligible to apply for these projects by
                completing the form. When a company posts a project, a
                notification will be sent to all faculty in the relevant area.
              </p>
              <p className="mt-4">
                <strong>Note:</strong> Faculty can recruit students exclusively
                from the Probe STEM portal based on project requirements. Upon
                project completion, students will receive a certificate from
                both the faculty and the industry partner.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;