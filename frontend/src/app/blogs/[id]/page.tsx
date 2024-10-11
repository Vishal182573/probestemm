"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    title?: string;
  };
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  author: {
    id: string;
    fullName: string;
    title: string;
    university: string;
  };
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs/${id}`);
        setBlogPost(response.data);
      } catch (error) {
        setError("Failed to fetch blog post");
        console.error("Error fetching blog post:", error);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogPost((prevPost) =>
        prevPost ? { ...prevPost, likes: prevPost.likes + 1 } : null
      );
    } catch (error) {
      console.error("Error liking blog post:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/blogs/${id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogPost((prevPost) =>
        prevPost ? { ...prevPost, dislikes: prevPost.dislikes + 1 } : null
      );
    } catch (error) {
      console.error("Error disliking blog post:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${API_URL}/blogs/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogPost((prevPost) =>
        prevPost
          ? { ...prevPost, comments: [...prevPost.comments, response.data] }
          : null
      );
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-[#82CAFF] text-gray-800 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#82CAFF] text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogPost.title}</h1>
          <p className="text-gray-600 mb-4">
            By {blogPost.author.fullName}, {blogPost.author.title} at{" "}
            {blogPost.author.university}
          </p>
          <p className="text-lg mb-6">{blogPost.content}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleLike}
            >
              <ThumbsUp className="mr-2" size={18} />
              {blogPost.likes}
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleDislike}
            >
              <ThumbsDown className="mr-2" size={18} />
              {blogPost.dislikes}
            </Button>
          </div>
        </article>
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <ul className="space-y-4 mb-6">
            {blogPost.comments.map((comment) => (
              <li key={comment.id} className="border-b pb-4">
                <p className="font-semibold">
                  {comment?.author?.fullName}
                  {comment?.author?.title && `, ${comment?.author?.title}`}
                </p>
                <p>{comment?.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment?.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#82CAFF]"
            />
            <Button
              type="submit"
              className="bg-[#82CAFF] hover:bg-[#6AB6E6] text-white"
            >
              <Send size={18} />
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
