// Client-side component declaration
"use client";

// Essential React and component imports
import React from "react";
import Image from "next/image";
import { SignupForm } from "@/components/shared/SignupForm";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { SIGNUP } from "../../../public";

// Main SignupPage component definition using TypeScript FC (Function Component) type
const SignupPage: React.FC = () => {
  return (
    // Root container with flex layout and minimum full viewport height
    <div className="flex flex-col min-h-screen bg-white ">
      {/* Navigation bar component with background */}
      <NavbarWithBg/>

      {/* Main content section with centered layout */}
      <main className="flex-grow flex items-center justify-center p-4 ">
        {/* Container for content with responsive max-width and flex layout */}
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          
          {/* Left section: Marketing content and image */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start space-y-6">
            {/* Main heading with custom styling */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#472014] font-caveat text-center md:text-left">
              Join the Future of STEM Learning
            </h1>
            {/* Subheading text */}
            <p className="text-xl text-black text-center md:text-left max-w-xl">
              Connect with mentors,
              collaborate on projects, and accelerate your STEM career.
            </p>
            {/* Decorative image using Next.js Image component */}
            <Image
              src={SIGNUP}
              alt="Signup illustration"
              width={500}
              height={500}
              className="w-full max-w-md rounded-lg"
            />
          </div>

          {/* Right section: Signup form */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <SignupForm />
          </div>
        </div>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

// Export the component as default
export default SignupPage;