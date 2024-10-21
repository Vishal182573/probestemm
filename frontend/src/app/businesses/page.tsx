import React from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { LOGO } from "../../../public";
import ContactForm from "@/components/shared/Feedback";
import { Footer } from "@/components/shared/Footer";

async function getBusinesses() {
  try {
    const res = await fetch(`${API_URL}/business`, {
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
    console.error("Error fetching businesses:", error);
    throw new Error(
      "Failed to fetch businesses. Please check the server connection and try again."
    );
  }
}

export default async function BusinessesPage() {
  try {
    const businesses = await getBusinesses();
    return (
      <div className="w-full bg-white">
        <NavbarWithBg/>
        <Banner imageSrc={LOGO} altText="project-banner-img" title="Cutting-Edge STEM Projects" subtitle="Explore groundbreaking projects and collaborate with leading experts in the field. Push the boundaries of science and technology with Probe STEM."/>
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Businesses
        </h1>
        <RoleList roles={businesses} roleType="business" />
      </AnimatedContainer>
      <ContactForm/>
      <Footer/>
      </div>
    );
  } catch (error) {
    return (
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Businesses
        </h1>
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </AnimatedContainer>
    );
  }
}
