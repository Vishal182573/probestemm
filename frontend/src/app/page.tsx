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
import Image from "next/image";
import { INDUSTRY, PROFESSOR, STUDENT } from "../../public";
import { RecentProjects } from "@/components/shared/RecentProjects";
import AnimatedBulletList from "@/components/shared/AnimatedBulletList";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
}

const HomePage = () => {
  // Main layout component that structures the entire homepage
  // Uses flex column layout with minimum full height and white background
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section - Main landing area with animated background */}
        <HeroSection />
        {/* Features section - Displays cards for Students, Academia, and Industry */}
        <FeaturesSection />
        {/* Project Sectionn */}
        <section className="py-10 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-bold text-center mb-6 text-gray-800"
            >
              Cutting-edge STEM Projects
            </motion.h2>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl text-center mb-6 text-gray-800"
            >
              Explore groundbreaking projects and collaborate with leading experts
            </motion.h2>
            {/* Features demo component with right-aligned image */}
            <RecentProjects />

            {/* find more button redirecting to projects page */}
            <div className="flex justify-center">
              <Link href="/projects/:tabName">
                <Button
                  className="bg-[#5e17eb] hover:bg-[#472014] text-white hover:text-white"
                >
                  Find More Projects <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </section>
        {/* Additional sections for different content types */}
        <FeaturedQuestionsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

// Array of image paths for the hero section background carousel
const images = [ "/c5.png","/c2.png","/c3.jpg","/c4.png","/c1.png","/c6.png"];

const HeroSection = () => {
  // State to manage current image index in the carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to handle automatic image rotation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Define bullet points for the animated list
  const bulletPoints = [
    { text: "PhD/Research positions openings", link: "/projects/faculty" },
    { text: "Faculty proposals available for industries", link: "/projects/faculty" },
    { text: "Students available for Internship", link: "/projects/students" },
    { text: "Students available for PhD/Research positions", link: "/projects/students" },
    { text: "Internship opportunities for students", link: "/projects/industry" },
    { text: "R&D Projects/Consultancy opportunities for faculty", link: "/projects/industry" }
  ];

  // Hero section with animated background, overlay, and call-to-action buttons
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background image carousel */}
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
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0  bg-[#eb5e17] opacity-60 z-10" />
      {/* Content container with animated elements */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto flex justify-center items-center">
        {/* Vertical buttons on the left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex flex-col items-start space-y-10 md:mr-8 mb-6 md:mb-0"
        >
          <Button
            size="lg"
            className="bg-[#5e17eb] hover:bg-[#3c246b] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl w-full sm:w-auto"
          >
            CURRENT OPENINGS
          </Button>
          
          {/* Replace the existing Link buttons with the AnimatedBulletList */}
          <AnimatedBulletList 
            bulletPoints={bulletPoints} 
            className="bg-transparent border-0 w-[25rem] h-[300px]"
          />
          
        </motion.div>
        <div className="flex flex-col md:flex-row justify-end items-center">
          {/* Hero text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-[150px] font-extrabold mb-6 text-[#472014] font-caveat"
            >
              Revolutionize <br /><span className="">STEM</span>{" "}
              <span className="bg-clip-text ">Research</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-4xl mb-10 text-black max-w-5xl mx-auto "
            >
              Connecting global researchers to inspire impactful collaborations
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#5e17eb] hover:bg-[#3c246b] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl w-full sm:w-auto"
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
        </div>
      </div>
      {/* Animated scroll indicator */}
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

// Reusable component for animated sections with direction control
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = "left",
}) => {
  // Animation controls and intersection observer for scroll-based animations
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Trigger animation when section comes into view
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
  // Configuration for the three main feature cards
  const features = [
    // Array of objects containing information for Students, Academia, and Industry cards
    // Each object includes icon, title, description, benefits, link, and background image
    {
      icon: <UserCircle className="h-16 w-16 text-[#472014]" />,
      title: "Student",
      description:
        "Connect with faculty/scientist and industry experts for",
      benefits: [
        "Research/PhD positions",
        "Industry internships",
        "Research projects",
      ],
      link: "/students",
      bgImage: STUDENT
    },
    {
      icon: <GraduationCap className="h-16 w-16 text-[#472014]" />,
      title: "Faculty/Scientist",
      description:
        "Build connections with students and industry for",
      benefits: [
        "Hiring students for internships/PhD positions and projects",
        "Technology transfer, consultancy and research projects",
      ],
      link: "/professors",
      bgImage: PROFESSOR
    },
    {
      icon: <Briefcase className="h-16 w-16 text-[#472014]" />,
      title: "Industry",
      description:
        "Connect with faculty and students for ",
      benefits: [
        "Hiring students for internships",
        "Contracting faculty/scientist for R&D projects",
        "Technological solutions",
      ],
      link: "/businesses",
      bgImage: INDUSTRY
    },
  ];

  // Renders the features section with animated cards
  return (
    <section className="py-24 px-4">
      {/* Animated section title */}
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-bold text-center mb-16 text-[#472014] font-caveat"
      >
        Why Choose Probe STEM?
      </motion.h2>
      {/* Grid layout for feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Map through features array to create animated cards */}
        {/* Each card includes background image, icon, title, benefits list, and CTA button */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl border-4 border-[#eb5e17] hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative h-56 w-full">
              <Image
                src={feature.bgImage}
                alt={`${feature.title} background`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={index === 0}
              />
            </div>
            <div className="p-8 flex flex-col items-center text-center flex-grow text-[#c1502e] ">
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
                <Button className="bg-[#5e17eb] hover:bg-[#472014] text-white hover:text-white">
                  Explore more <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
