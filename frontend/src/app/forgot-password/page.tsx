"use client"; // Marks this as a client-side component in Next.js

// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/shared/Footer";
import { motion } from "framer-motion";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { LOGIN } from "../../../public";
import ForgotPasswordForm from "@/components/shared/forgotForm";

// Main Forgot Password page component
const Forgotpage: React.FC = () => {
  // Initialize router for navigation
  const router = useRouter();
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);

  // Effect hook to check authentication status on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {  // Check if code is running in browser
      if (localStorage.getItem("token")) {  // If user is already logged in
        router.push("/");  // Redirect to home page
      } else {
        setIsLoading(false);  // If no token, stop loading state
      }
    }
  }, [router]);

  // Loading screen component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#c1502e] to-[#686256]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl font-caveat"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar component */}
      <NavbarWithBg/>
      
      <main className="flex-grow">
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Background gradient overlay */}
          <div className="absolute inset-0  opacity-80" />

          {/* Main content container */}
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Left column - Welcome message and illustration */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}  // Initial animation state
                animate={{ opacity: 1, x: 0 }}    // Final animation state
                transition={{ duration: 0.8 }}     // Animation duration
                className="text-center md:text-left space-y-8"
              >
                {/* Welcome heading */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#472014] font-caveat leading-tight">
                  Welcome Back to{" "}
                  <span className="block mt-2">Probe STEM</span>
                </h1>
                
                {/* Welcome message */}
                <p className="text-xl md:text-2xl text-[#472014] max-w-xl mx-auto md:mx-0">
                  Log in to continue your journey in STEM education and innovation to connect with our global community.
                </p>
                
                {/* Login illustration */}
                <div className="relative w-full max-w-lg mx-auto md:mx-0 aspect-video">
                  <Image
                    src={LOGIN}
                    alt="Login illustration"
                    fill
                    className="object-cover rounded-xl "
                    priority
                  />
                </div>
              </motion.div>

              {/* Right column - Forgot password form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}    // Initial animation state
                animate={{ opacity: 1, x: 0 }}     // Final animation state
                transition={{ duration: 0.8, delay: 0.2 }}  // Animation duration with delay
                className="flex justify-center items-center"
              >
                <ForgotPasswordForm/>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default Forgotpage;