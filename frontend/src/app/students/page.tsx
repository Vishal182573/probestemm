import React from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

async function getStudents() {
  try {
    const res = await fetch(`${API_URL}/student`, {
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
      <div className="bg-white w-full h-screen">
        <NavbarWithBg/>
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Students
        </h1>
        <RoleList roles={students} roleType="student" />
      </AnimatedContainer>
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
