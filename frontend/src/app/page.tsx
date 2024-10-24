/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components//shared/Footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Briefcase,
  UserCircle,
  GraduationCap,
  ChevronDown,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotificationsComponent from "@/components/shared/Notifications";
import ContactForm from "@/components/shared/Feedback";
import FeaturedQuestionsSection from "@/components/shared/FeaturedQuestionSection";
import WebinarSliderSection from "@/components/shared/WebinarSliding";
import FeaturesDemo from "@/components/shared/TextImageComponent";
import TestimonialsSection from "@/components/shared/Testimonials";
import FAQSection from "@/components/shared/Faq";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <WebinarSliderSection />
        <FeaturesDemo imagePosition="right" />
        <FeaturedQuestionsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

const images = ["/c1.png", "/c2.png", "/c3.png","/c4.png","/c5.png"];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#c1502e] to-[#686256] opacity-80 z-10" />
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-[150px] font-extrabold mb-6 text-[#472014] font-caveat"
        >
          Connecting <span className="">Minds</span>{" "}
          <span className="bg-clip-text ">Globally</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-4xl mb-10 text-black max-w-5xl mx-auto "
        >
          <span className=" text-[#472014] font-bold">Probe STEM:</span>{" "}
          fostering dynamic collaboration among students, faculty, and industry
          experts to drive innovation
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[#c1502e] hover:bg-[#003d82] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Get Started
              <Rocket className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-[#0056b3] text-lg w-full sm:w-auto"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown className="text-white h-10 w-6" />
      </motion.div>
    </section>
  );
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = "left",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
const FeaturesSection = () => {
  const features = [
    {
      icon: <UserCircle className="h-16 w-16 text-[#472014]" />,
      title: "Student Profile",
      description:
        "Showcase your academic journey, research highlights, and achievements. Connect with professors and industry partners for exciting opportunities.",
      benefits: [
        "Personalized learning dashboard",
        "Project collaboration tools",
        "Research publication tracking",
      ],
      link: "/students",
    },
    {
      icon: <GraduationCap className="h-16 w-16 text-[#472014]" />,
      title: "Professor Profile",
      description:
        "Manage your academic portfolio, showcase research projects, and connect with talented students and industry partners.",
      benefits: [
        "Webinar hosting platform",
        "Research project management",
        "Student talent pool access",
      ],
      link: "/professors",
    },
    {
      icon: <Briefcase className="h-16 w-16 text-[#472014]" />,
      title: "Industry Profile",
      description:
        "Discover top talent, collaborate on cutting-edge research projects, and stay at the forefront of innovation in your industry.",
      benefits: [
        "AI-powered talent matching",
        "Research collaboration tools",
        "Industry-academia networking",
      ],
      link: "/businesses",
    },
  ];

  return (
    <section className=" py-24 px-4">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-bold text-center mb-16 text-[#472014] font-caveat"
      >
        Why Choose Probe STEM?
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-xl border-4 border-[#c1502e] hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col items-center text-center flex-grow text-[#c1502e]">
              {feature.icon}
              <h3 className="text-3xl font-bold mt-6 mb-4 text-[#472014] font-caveat">
                {feature.title}
              </h3>
              <p className="text-[#472014] text-lg mb-6">
                {feature.description}
              </p>
              <ul className="text-left w-full mb-6">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-[#472014] mr-2" />
                    <span className="text-[#472014]">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href={feature.link}>
                <Button className="bg-[#c1502e] hover:bg-[#472014] text-white">
                  Explore more <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
