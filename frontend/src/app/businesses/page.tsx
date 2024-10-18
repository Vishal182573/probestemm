import React from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";

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
      <div className="w-full h-screen bg-white">
      <AnimatedContainer>
        <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
          Businesses
        </h1>
        <RoleList roles={businesses} roleType="business" />
      </AnimatedContainer>
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
