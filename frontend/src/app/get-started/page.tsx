// Enable client-side rendering for this component
"use client";

// Import necessary dependencies
import Link from "next/link";
import { motion } from "framer-motion"; // For animations
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ArrowRight, GraduationCap, Users, Briefcase } from "lucide-react"; // Icons

// Main component definition
const GetStartedPage = () => {
  // Array of profile objects containing information for each user type
  // Each profile has a title, icon, description, gradient color, and link
  const profiles = [
    {
      title: "Join as Teacher",
      icon: <GraduationCap className="h-16 w-16 text-white" />,
      description:
        "Empower the next generation of innovators with cutting-edge tools and global reach.",
      color: "from-purple-500 to-indigo-500",
      link: "/teacher-profile",
    },
    {
      title: "Join as Student",
      icon: <Users className="h-16 w-16 text-white" />,
      description:
        "Embark on a personalized learning journey and connect with a global community of peers.",
      color: "from-pink-500 to-rose-500",
      link: "/student-profile",
    },
    {
      title: "Business Profile",
      icon: <Briefcase className="h-16 w-16 text-white" />,
      description:
        "Partner with us to access top talent and drive innovation in your industry.",
      color: "from-blue-500 to-cyan-500",
      link: "/business-profile",
    },
  ];

  return (
    // Main container with gradient background and flex layout
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Navigation bar component */}
      <Navbar />
      
      {/* Main content section */}
      <main className="flex-grow py-20 px-4">
        {/* Animated heading using Framer Motion */}
        <motion.h1
          className="text-5xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }} // Initial animation state
          animate={{ opacity: 1, y: 0 }}   // Final animation state
          transition={{ duration: 0.5 }}    // Animation duration
        >
          Get Started with Probe Stemm
        </motion.h1>

        {/* Grid container for profile cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Map through profiles array to create profile cards */}
          {profiles.map((profile, index) => (
            // Animated card container
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation delay
            >
              {/* Card content container */}
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Profile icon with gradient background */}
                <div
                  className={`p-4 rounded-full bg-gradient-to-br ${profile.color} mb-6`}
                >
                  {profile.icon}
                </div>

                {/* Profile title */}
                <h2 className="text-2xl font-bold mb-4 text-black">
                  {profile.title}
                </h2>

                {/* Profile description */}
                <p className="text-gray-600 mb-6">{profile.description}</p>

                {/* Navigation link with styled button */}
                <Link href={profile.link}>
                  <Button
                    className={`bg-gradient-to-r ${profile.color} text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Gradient overlay for card background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-10`}
              ></div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

// Export the component as default
export default GetStartedPage;
