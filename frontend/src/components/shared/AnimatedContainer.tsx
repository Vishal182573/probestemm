"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
