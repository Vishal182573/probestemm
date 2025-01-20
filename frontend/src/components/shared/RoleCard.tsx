"use client";

// Import necessary dependencies
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // For animation effects
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the props interface for the RoleCard component
interface RoleCardProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: any; // Contains the role data (student, professor, or business)
  roleType: "student" | "professor" | "business"; // Specifies the type of role
}

// Main RoleCard component definition
const RoleCard: React.FC<RoleCardProps> = ({ role, roleType }) => {
  // Helper function to render different details based on roleType
  const renderDetails = () => {
    switch (roleType) {
      // Student role details layout
      case "student":
        return (
          <>
            <p className="text-gray-600 mb-1">Name: {role.fullName}</p>
            <p className="text-gray-600 mb-1">University/Institution: {role.university}</p>
            <p className="text-gray-600 mb-1">Course: {role.course}</p>
            <p className="text-gray-600 mb-1">Country: {role.location}</p>
          </>
        );
      // Professor role details layout
      case "professor":
        return (
          <>
            <p className="text-gray-600 mb-1">Name: {role.fullName}</p>
            <p className="text-gray-600 mb-1">Designation: {role.title}</p>
            <p className="text-gray-600 mb-1">Department: {role.department}</p>
            <p className="text-gray-600 mb-1">University/Institution: {role.university}</p>
            <p className="text-gray-600 mb-1">Country: {role.location}</p>
          </>
        );
      // Business role details layout
      case "business":
        return (
          <>
            <p className="text-gray-600 mb-1">Company: {role.companyName}</p>
            <p className="text-gray-600 mb-1">Industry: {role.industry}</p>
            <p className="text-gray-600 mb-1">Country: {role.location}</p>
            <p className="text-gray-600 mb-1">Website: {role.website}</p>
          </>
        );
      default:
        return null;
    }
  };

  // Return the main component JSX
  return (
    // Wrapper with animation effects using framer-motion
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {/* Main card container with custom styling */}
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-[#c1502e]">
        <CardContent className="p-6">
          {/* Header section with avatar and name/company */}
          <div className="flex items-center mb-4">
            {/* Avatar component with fallback */}
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage
                src={role.photoUrl || role.profileImageUrl || role.imageUrl}
                alt={role.fullName || role.companyName}
              />
              {/* Fallback shows initials if no image is available */}
              <AvatarFallback className="text-[#472014] bg-[#c1502e]/10">
                {(role.fullName || role.companyName)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* Name/Company heading */}
            <h2 className="text-2xl font-bold text-[#472014]">
              {role.fullName || role.companyName}
            </h2>
          </div>
          {/* Render role-specific details */}
          {renderDetails()}
          {/* Link to detailed profile page */}
          <Link href={`/${roleType}-profile/${role.id}`}>
            <Button className="mt-4 bg-[#c1502e] hover:bg-[#472014] text-white">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoleCard;
