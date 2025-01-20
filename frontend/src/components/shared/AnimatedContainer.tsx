// Enable client-side functionality in Next.js
"use client";

// Import necessary dependencies
import React from "react";
import { motion } from "framer-motion"; // Import motion component from framer-motion for animations

// Define the type interface for component props
interface AnimatedContainerProps {
  children: React.ReactNode; // Accepts any valid React node as children
}

// Define the AnimatedContainer component using React.FC (Function Component) with TypeScript
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children }) => {
  return (
    // motion.div is a animated div component from framer-motion
    <motion.div
      // Set initial animation state - component starts invisible
      initial={{ opacity: 0 }}
      // Define the animation target state - component fades in to full opacity
      animate={{ opacity: 1 }}
      // Configure animation timing
      transition={{ duration: 0.5 }} // Animation takes 0.5 seconds to complete
      // Apply Tailwind CSS classes for layout
      className="container mx-auto py-8" // Centers container, adds horizontal auto margins and vertical padding
    >
      {/* Render the child components passed to AnimatedContainer */}
      {children}
    </motion.div>
  );
};

// Export the component as default export
export default AnimatedContainer;
