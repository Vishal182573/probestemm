"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/components/shared/Footer";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { ProjectCategories } from "@/lib/pre-define-data";

// Object containing category-subcategory mapping for scientific disciplines
// Each key represents a main category with an array of related subcategories
const categories = ProjectCategories as Record<string, string[]>;

// Main component for the Ask Question page
const AskQuestion: React.FC = () => {
  // State management using React hooks
  // Tracks form input values and submission status
  const [title, setTitle] = useState("");          // Question title
  const [description, setDescription] = useState(""); // Question description
  const [category, setCategory] = useState("");    // Selected main category
  const [subcategory, setSubcategory] = useState(""); // Selected subcategory
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission status
  
  // Hooks for navigation and toast notifications
  const router = useRouter();
  const { toast } = useToast();

  // Form submission handler
  // Sends question data to the backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Retrieve authentication token and user ID from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const studentId = localStorage.getItem("userId");
      if (!studentId) {
        throw new Error("No student ID found");
      }

      // Make API request to create new discussion/question
      await axios.post(
        `${API_URL}/discussion/create`,
        {
          title,
          description,
          category,
          subcategory,
          studentId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message and redirect to home page
      toast({
        title: "Success",
        description: "Your question has been submitted successfully.",
        variant: "default",
      });

      router.push("/");
    } catch (error) {
      // Handle and display error if submission fails
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Navigation bar component */}
      <NavbarWithBg/>
      
      {/* Main container with animation */}
      <div className="min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="container mx-auto p-4 sm:p-6 md:p-8"
        >
          {/* Animated page title */}
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-5xl sm:text-6xl font-extrabold mb-8 text-[#472014] font-caveat text-center"
          >
            Ask a Question
          </motion.h1>

          {/* Question submission form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto text-black">
            {/* Title input field */}
            <div>
              <label
                htmlFor="title"
                className="block text-xl font-bold text-[#472014] mb-2"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your question title"
                className="w-full border-2 border-[#c1502e] rounded-lg p-3 bg-white"
                required
              />
            </div>

            {/* Description textarea field */}
            <div>
              <label
                htmlFor="description"
                className="block text-xl font-bold text-[#472014] mb-2"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details about your question"
                className="w-full h-32 border-2 border-[#c1502e] rounded-lg p-3"
                required
              />
            </div>

            {/* Category and Subcategory selection container */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Category dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="category"
                  className="block text-xl font-bold text-[#472014] mb-2"
                >
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setSubcategory("");
                  }}
                  required
                >
                  <SelectTrigger className="border-2 border-[#c1502e] rounded-lg p-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory dropdown - enabled only when category is selected */}
            <div className="flex-1">
                <label
                  htmlFor="subcategory"
                  className="block text-xl font-bold text-[#472014] mb-2"
                >
                  Subcategory
                </label>
                <Select
                  value={subcategory}
                  onValueChange={setSubcategory}
                  disabled={!category}
                  required
                >
                  <SelectTrigger className="border-2 border-[#c1502e] rounded-lg p-3">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                  {category &&
                    categories[category].map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

           {/* Submit button - shows loading state during submission */}
           <Button
              type="submit"
              className="w-full bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        </motion.div>
      </div>
      
      {/* Footer component */}
      <Footer />
    </>
  );
};

export default AskQuestion;