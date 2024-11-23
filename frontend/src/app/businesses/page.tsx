/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-unsafe-function-type */
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
import { Search } from "lucide-react";

interface Business {
  id: string;
  companyName: string;
  industry?: string;
  location?: string;
  website?: string;
  profileImageUrl?: string;
}

async function searchBusinesses(query?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.append('query', query);
    }

    const res = await fetch(
      `${API_URL}/businesss/search?${searchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.data; // Access the data array from the response
  } catch (error) {
    console.error("Error searching businesses:", error);
    throw new Error(
      "Failed to search businesses. Please check the server connection and try again."
    );
  }
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
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

  const fetchBusinesses = async (query: string) => {
    try {
      setLoading(true);
      const data = await searchBusinesses(query);
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
    debouncedFetch(searchQuery);
  }, [searchQuery]);

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

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-black"
                placeholder="Search industries by name, location, or industry type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="relative mt-8">
              <RoleList roles={businesses} roleType="business" />
              {businesses.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No Industries found matching your search criteria.
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