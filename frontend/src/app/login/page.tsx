"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/shared/LoginForm";
import { Footer } from "@/components/shared/Footer";
import { motion } from "framer-motion";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { LOGIN } from "../../../public";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarWithBg/>
      <main className="flex-grow">
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#c1502e] to-[#686256] opacity-80" />

          {/* Main content */}
          <div className="relative z-10 container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left space-y-8"
              >
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#472014] font-caveat leading-tight">
                  Welcome Back to{" "}
                  <span className="block mt-2">Probe STEM</span>
                </h1>
                <p className="text-xl md:text-2xl text-[#472014] max-w-xl mx-auto md:mx-0">
                  Continue your journey in STEM education and innovation.
                  Join our global community of learners and innovators.
                </p>
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

              {/* Right column - Login Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center items-center"
              >
                <LoginForm />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;