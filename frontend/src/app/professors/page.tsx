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
import { ReloadIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

interface Professor {
  id: string;
  fullName: string;
  title?: string;
  department?: string;
  university?: string;
  location?: string;
  photoUrl?: string;
  email?: string;
  website?: string;
  degree?: string;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function searchProfessors(query?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.append('query', query);
    }

    const res = await fetch(
      `${API_URL}/professors/search?${searchParams.toString()}`,
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
    console.error("Error searching professors:", error);
    throw new Error(
      "Failed to search professors. Please check the server connection and try again."
    );
  }
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchProfessors = async (query: string) => {
    try {
      setLoading(true);
      const data = await searchProfessors(query);
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
    debouncedFetch(searchQuery);
  }, [searchQuery]);

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
            Professors/Researchers
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10 pr-4 py-2 border-gray-200 focus:border-blue-300 bg-white"
                placeholder="Search professors by name, designation, department, university, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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