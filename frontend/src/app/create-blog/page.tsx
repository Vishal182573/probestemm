"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

type CreateBlogPostProps = unknown;

/**
 * CreateBlogPost Component
 * A form component that allows professors and business users to create blog posts
 * Includes authentication checks, image upload, and form submission handling
 */
const CreateBlogPost: React.FC<CreateBlogPostProps> = () => {
  // State management for form inputs and loading state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  /**
   * Authentication Check Effect
   * Runs on component mount to verify user authorization
   * Redirects to login if user is not authenticated or lacks proper role
   */
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

  const fetchBlogDetails = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      const blogData = response.data;
      
      // Set form fields with blog data
      setTitle(blogData.title);
      setContent(blogData.content);
      // Set other fields as needed
      
      // Set edit mode
      setIsEditing(true);
      setEditId(id);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      toast({ 
        title: 'Error fetching blog details', 
        variant: 'destructive' 
      });
    }
  };

  // Check if we're in edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
      // Fetch blog details and populate form
      fetchBlogDetails(editId);
    }
  }, [fetchBlogDetails]);

  /**
   * Image Upload Handler
   * Manages the file input change event for blog post images
   * @param e - Input change event containing the selected file
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  /**
   * Form Submission Handler
   * Processes the blog post creation
   * 1. Prevents default form submission
   * 2. Validates authentication
   * 3. Constructs FormData with blog details
   * 4. Sends POST request to API
   * 5. Handles success/error responses
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("blogImage", image);
      }

      let response;
      
      if (isEditing && editId) {
        // Update existing blog post
        response = await axios.put(`${API_URL}/blogs/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast({
          title: "Success",
          description: "Your blog post has been updated successfully.",
        });
      } else {
        // Create new blog post
        response = await axios.post(`${API_URL}/blogs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast({
          title: "Success",
          description: "Your blog post has been created successfully.",
        });
      }

      console.log(isEditing ? "Blog updated:" : "Blog created:", response.data);
      router.push("/blogs");
    } catch (error) {
      console.error(isEditing ? "Error updating blog post:" : "Error creating blog post:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "create"} blog post: ${
            error.response.data.error || error.message
          }`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            `An unexpected error occurred while ${isEditing ? "updating" : "creating"} the blog post. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Component UI Render
   * Structured in a card layout with:
   * - Navigation bar
   * - Form inputs for title, content, and image
   * - Submit button with loading state
   * - Footer component
   */
  return (
    <div className="min-h-screen bg-white">
      <NavbarWithBg />
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto border-2 border-[#c1502e] shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-5xl sm:text-6xl font-extrabold text-[#472014] font-caveat flex items-center justify-center">
              <Pencil className="mr-4 h-12 w-12" />
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
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
                  {isEditing ? 'Update' : ""} Image
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
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Blog Post" : "Create Blog Post")}
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
