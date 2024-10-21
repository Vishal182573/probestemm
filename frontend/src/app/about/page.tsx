"use client"
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
import Banner from "@/components/shared/Banner";
import FeaturesDemo from "@/components/shared/TextImageComponent";
import ContactForm from "@/components/shared/Feedback";
import { LOGO} from "../../../public"; // Assume this is the path to your banner image

const CountUpAnimation = ({ end, duration = 2000, label }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    const animateCount = (timestamp) => {
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
      <div className="text-4xl font-bold text-[#c1502e]">{count}</div>
      <div className="text-sm text-[#472014]">{label}</div>
    </div>
  );
};

const Stats = () => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white/90 backdrop-blur shadow-xl rounded-lg p-6 mb-12">
    <CountUpAnimation end={5000} label="Students Enrolled" />
    <CountUpAnimation end={200} label="Professors Associated" />
    <CountUpAnimation end={100} label="Industries Associated" />
    <CountUpAnimation end={500} label="Projects Completed" />
    <CountUpAnimation end={15} label="Avg. Professor Experience (Years)" />
  </div>
);

const AboutUsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <NavbarWithBg />
      <Banner
        imageSrc={LOGO}
        altText="About Us Banner"
        title="Probe STEM"
        subtitle="Empowering the next generation of innovators"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >

        <Stats />

        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-8 text-center text-[#472014] font-caveat"
        >
          Why choose Probe STEM?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
                  In today's era of innovation, academics and industry often
                  work in isolation. Bridging the gap between them could spark a
                  revolution, allowing researchers to make more meaningful
                  contributions by aligning their work with real-world
                  applications.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
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
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/90 backdrop-blur shadow-xl mb-12">
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

      <FeaturesDemo />
      <FeaturesDemo />
      <FeaturesDemo />
      
      <ContactForm />
      <Footer />
    </div>
  );
};

export default AboutUsPage;