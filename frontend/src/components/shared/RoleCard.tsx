"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RoleCardProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: any;
  roleType: "student" | "professor" | "business";
}

const RoleCard: React.FC<RoleCardProps> = ({ role, roleType }) => {
  const renderDetails = () => {
    switch (roleType) {
      case "student":
        return (
          <>
            <p className="text-gray-600 mb-1">Name: {role.fullName}</p>
            <p className="text-gray-600 mb-1">University/Institution: {role.university}</p>
            <p className="text-gray-600 mb-1">Course: {role.course}</p>
            <p className="text-gray-600 mb-1">Country: {role.location}</p>
          </>
        );
      case "professor":
        return (
          <>
            <p className="text-gray-600 mb-1">Name: {role.fullName}</p>
            <p className="text-gray-600 mb-1">Designation: {role.title}</p>
            <p className="text-gray-600 mb-1">Department: {role.department}</p>
            <p className="text-gray-600 mb-1">University: {role.university}</p>
            <p className="text-gray-600 mb-1">Country: {role.location}</p>
          </>
        );
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

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-[#c1502e]">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage
                src={role.photoUrl || role.profileImageUrl}
                alt={role.fullName || role.companyName}
              />
              <AvatarFallback className="text-[#472014] bg-[#c1502e]/10">
                {(role.fullName || role.companyName)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-[#472014]">
              {role.fullName || role.companyName}
            </h2>
          </div>
          {renderDetails()}
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
