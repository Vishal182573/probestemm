"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type CreateBlogPostProps = unknown;

const CreateBlogPost: React.FC<CreateBlogPostProps> = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "professor" && role !== "business")) {
      router.push("/login");
      toast({
        title: "Unauthorized",
        description:
          "Please log in as a professor or business to create a blog post.",
        variant: "destructive",
      });
    }
  }, [router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/blogs`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Blog created:", response.data);
      toast({
        title: "Success",
        description: "Your blog post has been created successfully.",
      });
      router.push("/blogs");
    } catch (error) {
      console.error("Error creating blog post:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: "Error",
          description: `Failed to create blog post: ${
            error.response.data.error || error.message
          }`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            "An unexpected error occurred while creating the blog post. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Pencil className="mr-2" />
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-100 text-gray-800 border-gray-300"
                  placeholder="Enter your blog title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-100 text-gray-800 border-gray-300"
                  rows={8}
                  placeholder="Write your blog content here..."
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                disabled={isLoading}
              >
                {isLoading ? "Publishing..." : "Publish Blog Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlogPost;
