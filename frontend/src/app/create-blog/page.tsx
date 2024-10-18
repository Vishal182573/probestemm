"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

type CreateBlogPostProps = unknown;

const CreateBlogPost: React.FC<CreateBlogPostProps> = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("blogImage", image);
      }

      const response = await axios.post(`${API_URL}/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
      <NavbarWithBg />
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto border-2 border-[#c1502e] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-5xl sm:text-6xl font-extrabold text-[#472014] font-caveat flex items-center justify-center">
              <Pencil className="mr-4 h-12 w-12" />
              Create New Blog Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 text-black">
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
                  className="w-full border-2 border-[#c1502e] rounded-lg p-3 bg-white"
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
                  placeholder="Enter your blog content"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-xl font-bold text-[#472014] mb-2"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-2 border-[#c1502e] rounded-lg p-3"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#c1502e] hover:bg-[#472014] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Blog Post"}
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
