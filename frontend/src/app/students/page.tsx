"use client"
import React from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { LOGO } from "../../../public";
import { Footer } from "@/components/shared/Footer";
import ContactForm from "@/components/shared/Feedback";

async function getStudents() {
  try {
    const res = await fetch(`${API_URL}/students`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error(
      "Failed to fetch students. Please check the server connection and try again."
    );
  }
}

export default async function StudentsPage() {
  try {
    const students = await getStudents();
    return (
      <div className="bg-white w-full">
        <NavbarWithBg />
        <Banner
          imageSrc={LOGO}
          altText="project-banner-img"
          title="Cutting-Edge STEM Projects"
          subtitle="Explore groundbreaking projects and collaborate with leading experts in the field. Push the boundaries of science and technology with Probe STEM."
        />
        <AnimatedContainer>
          <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
            Students
          </h1>
          <RoleList roles={students} roleType="student" />
        </AnimatedContainer>
        <ContactForm />
        <Footer />
      </div>
    );
  } catch (error) {
    return (
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Students
        </h1>
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </AnimatedContainer>
    );
  }
}
