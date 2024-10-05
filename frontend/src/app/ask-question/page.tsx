"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
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
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useRouter } from "next/navigation";

const categories: { [key: string]: string[] } = {
  Science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Earth Sciences",
    "Space Science",
  ],
  Technology: ["Computer Science", "Engineering"],
  Engineering: [
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
  ],
  Mathematics: ["Pure Mathematics", "Applied Mathematics"],
  "Engineering Technology": [
    "Data Engineering",
    "Robotics",
    "Biotechnology",
    "Environmental Technology",
    "Space Technology",
    "Pharmaceutical Engineering",
  ],
};

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const router= useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ title, description, category, subcategory });
    // Redirect to the discussion forum after submission
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-primary"
        >
          Ask a Question
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your question title"
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your question"
              className="w-full h-32"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-foreground mb-2"
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
                <SelectTrigger>
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

            <div className="flex-1">
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Subcategory
              </label>
              <Select
                value={subcategory}
                onValueChange={setSubcategory}
                disabled={!category}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {category &&
                    categories[category as keyof typeof categories].map(
                      (subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white"
          >
            Submit Question
          </Button>
        </form>
      </motion.div>
      <Footer />
    </>
  );
};

export default AskQuestion;
