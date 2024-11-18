/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import RoleList from "@/components/shared/RoleList";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { BUSINESSPAGE } from "../../../public";
import ContactForm from "@/components/shared/Feedback";
import { Footer } from "@/components/shared/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";

interface BusinessFilters {
  companyName?: string;
  industry?: string;
  location?: string;
  website?: string;
}

interface Business {
  id: string;
  companyName: string;
  industry?: string;
  location?: string;
  website?: string;
  profileImageUrl?: string;
}

async function getBusinesses(filters: BusinessFilters = {}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const res = await fetch(
      `${API_URL}/businesss/?${searchParams.toString()}`,
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
    console.error("Error fetching businesses:", error);
    throw new Error(
      "Failed to fetch businesses. Please check the server connection and try again."
    );
  }
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filters, setFilters] = useState<BusinessFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchBusinesses = async (currentFilters: BusinessFilters) => {
    try {
      setLoading(true);
      const data = await getBusinesses(currentFilters);
      setBusinesses(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchBusinesses, 500);

  useEffect(() => {
    debouncedFetch(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof BusinessFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <div className="bg-white w-full">
      <NavbarWithBg />
      <Banner
        imageSrc={BUSINESSPAGE}
        altText="project-banner-img"
        title="Partner Industries"
        subtitle="Engage with top industries at the forefront of innovation. Explore opportunities for projects, internships, and partnerships that drive advancements in Science and Technology"
      />
      <AnimatedContainer>
        <div className="space-y-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-[#472014] font-caveat">
            Industries
          </h1>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-xl shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
              <Input
                id="companyName"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by company name..."
                onChange={(e) => handleFilterChange("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-gray-700">Industry</Label>
              <Input
                id="industry"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by industry..."
                onChange={(e) => handleFilterChange("industry", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">Location</Label>
              <Input
                id="location"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by location..."
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-700">Website</Label>
              <Input
                id="website"
                className="border-gray-200 focus:border-blue-300"
                placeholder="Search by website..."
                onChange={(e) => handleFilterChange("website", e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <ReloadIcon className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading Industries...</span>
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
              <RoleList roles={businesses} roleType="business" />
              {businesses.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No Industires found matching your search criteria.
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