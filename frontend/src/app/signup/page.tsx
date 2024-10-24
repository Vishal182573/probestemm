"use client";
import React from "react";
import Image from "next/image";
import { SignupForm } from "@/components/shared/SignupForm";
import { Footer } from "@/components/shared/Footer";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { SIGNUP } from "../../../public";

const SignupPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <NavbarWithBg/>
      <main className="flex-grow flex items-center justify-center p-4 ">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#472014] font-caveat text-center md:text-left">
              Join the Future of STEM Learning
            </h1>
            <p className="text-xl text-white text-center md:text-left max-w-xl">
              <span className="font-bold">Probe STEM:</span> Connect with mentors,
              collaborate on projects, and accelerate your STEM career.
            </p>
            <Image
              src={SIGNUP}
              alt="Signup illustration"
              width={500}
              height={500}
              className="w-full max-w-md"
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;