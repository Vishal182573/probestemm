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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto border-2 border-[#c1502e] shadow-xl">
          <CardHeader>
            <CardTitle className="text-5xl sm:text-6xl font-extrabold text-[#472014] font-caveat flex items-center justify-center">
              <Pencil className="mr-4 h-12 w-12" />
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full border-2 border-[#c1502e] rounded-lg p-3"
                  placeholder="Enter your blog title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-xl font-bold text-[#472014] mb-2"
                >
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border-2 border-[#c1502e] rounded-lg p-3"
                  rows={8}
                  placeholder="Write your blog content here..."
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#c1502e] hover:bg-[#003d82] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
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
