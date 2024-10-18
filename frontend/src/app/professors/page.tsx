import React from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

async function getProfessors() {
  try {
    const res = await fetch(`${API_URL}/professors`, {
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
    console.error("Error fetching professors:", error);
    throw new Error(
      "Failed to fetch professors. Please check the server connection and try again."
    );
  }
}

export default async function ProfessorsPage() {
  try {
    const professors = await getProfessors();
    return (
      <div className="w-full h-screen bg-white">
        <NavbarWithBg/>
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Professors
        </h1>
        <RoleList roles={professors} roleType="professor" />
      </AnimatedContainer>
      </div>
    );
  } catch (error) {
    return (
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Professors
        </h1>
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </AnimatedContainer>
    );
  }
}
