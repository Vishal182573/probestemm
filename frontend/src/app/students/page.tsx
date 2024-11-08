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
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

interface StudentFilters {
  fullName?: string;
  university?: string;
  course?: string;
  location?: string;
}

interface Student {
  id: string;
  fullName: string;
  university?: string;
  course?: string;
  location?: string;
  imageUrl?: string;
  // add other student properties as needed
}

async function getStudents(filters: StudentFilters = {}) {
  try {
    // Convert filters object to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const res = await fetch(
      `${API_URL}/students/?${searchParams.toString()}`,
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
    console.error("Error fetching students:", error);
    throw new Error(
      "Failed to fetch students. Please check the server connection and try again."
    );
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<StudentFilters>({});
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

  // Fetch students with current filters
  const fetchStudents = async (currentFilters: StudentFilters) => {
    try {
      setLoading(true);
      const data = await getStudents(currentFilters);
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
    debouncedFetch(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined // Only include the filter if it has a value
    }));
  };

  return (
    <div className="bg-white w-full">
      <NavbarWithBg />
      <Banner
        imageSrc={STUDENTPAGE}
        altText="project-banner-img"
        title="Our Outstanding Students"
        subtitle="Explore the achievements, projects, and dedication of students shaping the future of Science and Technology"
      />
      <AnimatedContainer>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
            Students
          </h1>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Search by name..."
                onChange={(e) => handleFilterChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                placeholder="Search by university..."
                onChange={(e) => handleFilterChange("university", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                placeholder="Search by course..."
                onChange={(e) => handleFilterChange("course", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Search by location..."
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
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