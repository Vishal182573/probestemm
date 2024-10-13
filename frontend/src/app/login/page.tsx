"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { NewsAlert } from "@/components/shared/NewsAlert";
import { LoginForm } from "@/components/shared/LoginForm";
import { Footer } from "@/components/shared/Footer";

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
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#82CAFF]">
      <Navbar />
      <NewsAlert isLoginPage={true} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center md:text-left">
              Welcome Back to Probe STEM
            </h1>
            <p className="text-xl text-white/80 text-center md:text-left">
              Continue your journey in STEM education and innovation.
            </p>
            <Image
              src="/path/to/your/image.jpg"
              alt="Login illustration"
              className="w-full max-w-md"
              width={500}
              height={300}
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
