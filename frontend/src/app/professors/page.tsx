/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { ALLPROFESSORS } from "../../../public";
import ContactForm from "@/components/shared/Feedback";
import { Footer } from "@/components/shared/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ProfessorFilters {
  fullName?: string;
  title?: string;
  department?: string;
  university?: string;
  location?: string;
}

interface Professor {
  id: string;
  fullName: string;
  title?: string;
  department?: string;
  university?: string;
  location?: string;
  photoUrl?: string;
}

async function getProfessors(filters: ProfessorFilters = {}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const res = await fetch(
      `${API_URL}/professors/?${searchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filters, setFilters] = useState<ProfessorFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchProfessors = async (currentFilters: ProfessorFilters) => {
    try {
      setLoading(true);
      const data = await getProfessors(currentFilters);
      setProfessors(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchProfessors, 500);

  useEffect(() => {
    debouncedFetch(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof ProfessorFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <div className="bg-white w-full">
      <NavbarWithBg />
      <Banner
        imageSrc={ALLPROFESSORS}
        altText="project-banner-img"
        title="Our Esteemed Professors"
        subtitle="Connect with world-class experts and explore their impactful contributions to Science and Technology"
      />
      <AnimatedContainer>
        <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
            Professors
          </h1>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6 bg-gray-50 rounded-xl shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input
                id="name"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by name..."
                onChange={(e) => handleFilterChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">Designation</Label>
              <Input
                id="title"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by Desination..."
                onChange={(e) => handleFilterChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-700">Department</Label>
              <Input
                id="department"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by department..."
                onChange={(e) => handleFilterChange("department", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university" className="text-gray-700">University</Label>
              <Input
                id="university"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by university..."
                onChange={(e) => handleFilterChange("university", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">Country</Label>
              <Input
                id="location"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by Country..."
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <ReloadIcon className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading professors...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-red-500 p-4 rounded-lg bg-red-50">
              Error: {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <div className="relative">
              <RoleList roles={professors} roleType="professor" />
              {professors.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No professors found matching your search criteria.
                </p>
              )}
            </div>
          )}
        </div>
      </AnimatedContainer>
      <ContactForm />
      <Footer />
    </div>
  );
}
