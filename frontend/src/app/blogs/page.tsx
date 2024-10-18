"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  User,
  Rocket,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

interface Author {
  id: string;
  fullName?: string;
  title?: string;
  university?: string;
  companyName?: string;
}

interface Comment {
  id: string;
  content: string;
  userType: "PROFESSOR" | "STUDENT" | "BUSINESS";
  student?: {
    id: string;
    fullName: string;
  };
  professor?: {
    id: string;
    fullName: string;
    title: string;
  };
  business?: {
    id: string;
    companyName: string;
  };
}

interface Blog {
  id: string;
  title: string;
  content: string;
  blogImage: string;
  likes: number;
  dislikes: number;
  authorType: "PROFESSOR" | "BUSINESS" | null;
  professorId: string | null;
  businessId: string | null;
  superAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  professor: Author | null;
  business: Author | null;
  comments: Comment[];
}

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Please log in to like blogs", variant: "destructive" });
        return;
      }

      await axios.post(
        `${API_URL}/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
        )
      );
      toast({ title: "Blog liked successfully" });
    } catch (error) {
      console.error("Error liking blog:", error);
      toast({ title: "Failed to like blog", variant: "destructive" });
    }
  };

  const handleDislike = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to dislike blogs",
          variant: "destructive",
        });
        return;
      }

      await axios.post(
        `${API_URL}/blogs/${blogId}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, dislikes: blog.dislikes + 1 } : blog
        )
      );
      toast({ title: "Blog disliked successfully" });
    } catch (error) {
      console.error("Error disliking blog:", error);
      toast({ title: "Failed to dislike blog", variant: "destructive" });
    }
  };

  const getAuthorInfo = (blog: Blog) => {
    if (blog.professor) {
      return {
        name: blog.professor.fullName,
        title: blog.professor.title,
        affiliation: blog.professor.university,
      };
    } else if (blog.business) {
      return {
        name: blog.business.companyName,
        title: "Business",
        affiliation: "",
      };
    }
    return { name: "Unknown", title: "", affiliation: "" };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavbarWithBg />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-black text-2xl font-caveat">
            <Rocket className="h-8 w-8 r-2 mr-2 text-[#c1502e]" />
            Loading blogs...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavbarWithBg />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-8 text-[#472014] font-caveat"
        >
          Probe STEM Blogs
        </motion.h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const authorInfo = getAuthorInfo(blog);
            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-xl border-2 border-[#c1502e]"
              >
                <h2 className="text-2xl font-semibold mb-4 text-[#472014] font-caveat">
                  {blog.title}
                </h2>
                <p className="text-[#686256] mb-2">
                  By {authorInfo.name}
                  {authorInfo.title && `, ${authorInfo.title}`}
                </p>
                <p className="text-[#686256] mb-4">{authorInfo.affiliation}</p>
                {blog.blogImage && (
                  <Image
                    src={blog.blogImage}
                    alt={blog.title}
                    width={300}
                    height={200}
                    className="mb-4 rounded-lg"
                  />
                )}
                <p className="text-[#472014] mb-6">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#c1502e] hover:text-white"
                      onClick={() => handleLike(blog.id)}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {blog.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#c1502e] hover:text-white "
                      onClick={() => handleDislike(blog.id)}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      {blog.dislikes}
                    </Button>
                  </div>

                  <Link href={`/blogs/${blog.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className=" border-[#c1502e] bg-[#472014] text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {blog.comments.length} Comments
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white bg-[#c1502e] hover:bg-[#472014] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <Link
                      href={
                        blog.professor
                          ? `/professor-profile/${blog.professor.id}`
                          : `/business-profile/${blog.business?.id}`
                      }
                    >
                      View Profile
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          {(userRole === "professor" || userRole === "business") && (
            <Link href="/create-blog">
              <Button
                variant="default"
                size="lg"
                className="bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-6 w-6" />
                Create New Blog
              </Button>
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
