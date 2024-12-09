/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { STUDENTPAGE } from "../../../public";
import { Footer } from "@/components/shared/Footer";
import ContactForm from "@/components/shared/Feedback";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  university?: string;
  course?: string;
  location?: string;
  imageUrl?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function searchStudents(query?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.append('query', query);
    }

    const res = await fetch(
      `${API_URL}/students/search?${searchParams.toString()}`,
      {
        cache: "no-store",
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
    console.error("Error searching students:", error);
    throw new Error(
      "Failed to search students. Please check the server connection and try again."
    );
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce function to prevent too many API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch students with search query
  const fetchStudents = async (query: string) => {
    try {
      setLoading(true);
      const data = await searchStudents(query);
      setStudents(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchStudents
  const debouncedFetch = debounce(fetchStudents, 500);

  useEffect(() => {
    debouncedFetch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="bg-white w-full">
      <NavbarWithBg />
      <Banner
        imageSrc={STUDENTPAGE}
        altText="project-banner-img"
        title="Our Outstanding Students"
        subtitle="Discover the achievements and dedication of students driving the future of Science and Technology"
      />
      <AnimatedContainer>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
            Students
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              className="pl-10 pr-4 py-2 bg-white text-black"
              placeholder="Search students by name, university, course, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <ReloadIcon className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading students...</span>
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
              <RoleList roles={students} roleType="student" />
              {students.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No students found matching your search criteria.
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