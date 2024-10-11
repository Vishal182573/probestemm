"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Plus } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Blog {
  id: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  author: {
    fullName: string;
    title: string;
    university: string;
  };
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs`);
        setBlogs(response.data);
      } catch (error) {
        setError("Failed to fetch blogs");
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/blogs/${blogId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
        )
      );
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleDislike = async (blogId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/blogs/${blogId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogId ? { ...blog, dislikes: blog.dislikes + 1 } : blog
        )
      );
    } catch (error) {
      console.error("Error disliking blog:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 text-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Probe STEM Blogs
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {blog.title}
              </h2>
              <p className="text-gray-700 mb-2">
                By {blog.author.fullName}, {blog.author.title}
              </p>
              <p className="text-gray-600 mb-4">{blog.author.university}</p>
              <p className="text-gray-700 mb-6">
                {blog.content.substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => handleLike(blog.id)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {blog.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700"
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
                    className="text-white border-gray-300"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {blog.comments.length} Comments
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/create-blog">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-5 w-5" />
              Create New Blog Post
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
