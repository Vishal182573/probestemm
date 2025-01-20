// NewsAlert.tsx
import React from "react";
import Link from "next/link";
import {Button} from "../ui/button";
import { FaBell } from "react-icons/fa";

// NewsAlert component that accepts an optional isLoginPage prop with a default value of false
// This component displays a notification banner with a call-to-action button
export const NewsAlert: React.FC<{ isLoginPage?: boolean }> = ({ isLoginPage = false }) => {
  return (
    // Main container with black background, text styling, and flexbox layout
    <div className="bg-black text-foreground p-4 flex justify-between items-center rounded-lg shadow-md">
      {/* Left section containing the bell icon and notification message */}
      <div className="flex items-center">
        {/* Bell icon from react-icons with white color and margin */}
        <FaBell className="text-white mr-3 text-xl" />
        {/* Notification message with white text and semi-bold font */}
        <p className="text-white text-md font-semibold">
          New STEM challenge starts next week! Join now and win exciting prizes.
        </p>
      </div>

      {/* Dynamic Link component that redirects to signup or login based on isLoginPage prop */}
      <Link href={isLoginPage ? "/signup" : "/login"}>
        {/* Button component with outline variant and custom styling */}
        <Button
          variant="outline"
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          {/* Dynamic button text based on isLoginPage prop */}
          {isLoginPage ? "Register Now" : "Login Now"}
        </Button>
      </Link>
    </div>
  );
};
