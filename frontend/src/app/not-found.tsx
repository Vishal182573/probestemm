"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <AlertCircle className="w-32 h-32 text-blue-400 mx-auto mb-8" />
        </motion.div>
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-6 text-blue-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-10 text-blue-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Oops! It seems you&apos;ve ventured into uncharted territory.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-md transition-all duration-300 text-lg"
            onClick={() => router.push("/")} // Use router.push instead of navigate
          >
            Return Home
            <Home className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
