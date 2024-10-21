"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaIndustry, FaGraduationCap, FaExchangeAlt } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import FeaturesDemo from "@/components/shared/TextImageComponent";
import ContactForm from "@/components/shared/Feedback";
import { LOGO } from "../../../public";
import Link from "next/link";

interface CountUpAnimationProps {
  end: number; // 'end' should be a number
  duration?: number; // Optional prop with a default value
  label?: string; // Optional prop
}

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
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#472014] mb-4">Our Motto</h2>
          <p className="text-xl text-[#472014]">
            Bridging academia and industry to transform research into
            innovation.
          </p>
        </motion.div>

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
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-[#472014] font-bold">
                  <FaIndustry className="mr-2 text-[#c1502e]" /> Industry
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#472014] text-lg">
                <p>
                  In today&apos;s era of innovation, academics and industry
                  often work in isolation. Bridging the gap between them could
                  spark a revolution, allowing researchers to make more
                  meaningful contributions by aligning their work with
                  real-world applications.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur shadow-xl border-none">
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
          <Card className="bg-white/90 backdrop-blur shadow-xl border-none mb-12">
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
              <Link href={"/projects"}>
                <Button className="mt-4 bg-[#c1502e] hover:bg-[#472014] hover:text-white">
                  Apply Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className=" py-16">
        <div className="container mx-auto">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-12 text-center text-[#472014]"
          >
            Our Key Partnerships
          </motion.h2>

          <div className="space-y-16">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-center text-[#c1502e]">
                For Students
              </h3>
              <FeaturesDemo imagePosition="left" />
              <div className="text-center mt-6">
                <Link href="/students">
                  <Button className="bg-[#c1502e] hover:bg-[#472014] text-white">
                    View Students
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-center text-[#c1502e]">
                For Professors
              </h3>
              <FeaturesDemo imagePosition="right" />
              <div className="text-center mt-6">
                <Link href="/professors">
                  <Button className="bg-[#c1502e] hover:bg-[#472014] text-white">
                    View Professors
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-center text-[#c1502e]">
                For Industry
              </h3>
              <FeaturesDemo imagePosition="left" />
              <div className="text-center mt-6">
                <Link href="/industry">
                  <Button className="bg-[#c1502e] hover:bg-[#472014] text-white">
                    View Industries
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ContactForm />
      <Footer />
    </div>
  );
};

export default AboutUsPage;
