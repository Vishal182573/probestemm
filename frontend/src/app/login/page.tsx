"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/shared/Footer";
import { motion } from "framer-motion";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { LOGIN } from "../../../public";
import LoginForm from "@/components/shared/LoginForm";

/**
 * LoginPage Component - Handles the main login page of the application
 * This is a client-side component as indicated by the "use client" directive
 */
const LoginPage: React.FC = () => {
  // Initialize router for navigation and loading state
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect hook to check authentication status on component mount
   * - Verifies if user is already logged in by checking for token in localStorage
   * - Redirects to home page if token exists
   * - Sets loading state to false if user is not authenticated
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  /**
   * Loading state UI
   * Displays a centered loading message with animation while checking auth status
   */
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

  /**
   * Main Login Page UI
   * Structure:
   * - Navbar at the top
   * - Main content section with two columns layout for larger screens
   * - Footer at the bottom
   */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar with background */}
      <NavbarWithBg/>
      
      <main className="flex-grow">
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Semi-transparent overlay for background */}
          <div className="absolute inset-0  opacity-80" />

          {/* Main content container with grid layout */}
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left column - Welcome message and illustration */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left space-y-8"
              >
                {/* Welcome heading with custom font and styling */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#472014] font-caveat leading-tight">
                  Welcome Back to{" "}
                  <span className="block mt-2">Probe STEM</span>
                </h1>
                
                {/* Welcome message paragraph */}
                <p className="text-xl md:text-2xl text-[#472014] max-w-xl mx-auto md:mx-0">
                  Log in to continue your journey in STEM education and innovation to connect with our global community.
                </p>
                
                {/* Login illustration image container */}
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

              {/* Right column - Login form with animation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center items-center"
              >
                <LoginForm/>
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

export default LoginPage;