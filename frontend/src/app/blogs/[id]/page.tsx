"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send, Trash } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userType: "STUDENT" | "PROFESSOR" | "BUSINESS";
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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  authorType: "PROFESSOR" | "BUSINESS";
  professor?: {
    id: string;
    fullName: string;
    title: string;
    university: string;
  };
  business?: {
    id: string;
    companyName: string;
    industry: string;
  };
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInteraction, setUserInteraction] = useState<
    "like" | "dislike" | null
  >(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBlogPost();
      fetchUserInteraction();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      setBlogPost(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch blog post");
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInteraction = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/blogs/${id}/user-interaction`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInteraction(response.data?.isLike ? "like" : "dislike");
    } catch (error) {
      console.error("Error fetching user interaction:", error);
    }
  };

  const handleLikeDislike = async (action: "like" | "dislike") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to interact with blogs",
          variant: "destructive",
        });
        return;
      }

      let endpoint = `${API_URL}/blogs/${id}/${action}`;
      let method = "POST";

      if (userInteraction === action) {
        // Remove like/dislike
        endpoint = `${API_URL}/blogs/${id}/${action}`;
        method = "DELETE";
      } else if (userInteraction) {
        // Change from like to dislike or vice versa
        await axios.delete(`${API_URL}/blogs/${id}/${userInteraction}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await axios({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInteraction(userInteraction === action ? null : action);
      fetchBlogPost(); // Refetch to get updated likes/dislikes count
      toast({
        title: `Blog ${action === "like" ? "liked" : "disliked"} successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ing blog post:`, error);
      toast({ title: `Failed to ${action} blog`, variant: "destructive" });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Please log in to comment", variant: "destructive" });
        return;
      }

      const response = await axios.post(
        `${API_URL}/blogs/${id}/comments`,
        { content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogPost((prevPost) =>
        prevPost
          ? { ...prevPost, comments: [...prevPost.comments, response.data] }
          : null
      );
      setNewComment("");
      toast({ title: "Comment added successfully" });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({ title: "Failed to add comment", variant: "destructive" });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to delete comments",
          variant: "destructive",
        });
        return;
      }

      await axios.delete(`${API_URL}/blogs/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              comments: prevPost.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : null
      );
      toast({ title: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({ title: "Failed to delete comment", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#82CAFF] flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-white text-2xl">Loading blog post...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-[#82CAFF] text-gray-800 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Blog post not found</h1>
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
            By {blogPost.professor?.fullName || blogPost.business?.companyName},{" "}
            {blogPost.professor
              ? `${blogPost.professor.title} at ${blogPost.professor.university}`
              : `${blogPost.business?.industry}`}
          </p>
          <p className="text-lg mb-6">{blogPost.content}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className={`flex items-center ${
                userInteraction === "like" ? "bg-blue-100" : ""
              }`}
              onClick={() => handleLikeDislike("like")}
            >
              <ThumbsUp className="mr-2" size={18} />
              {blogPost.likes}
            </Button>
            <Button
              variant="default"
              className={`flex items-center ${
                userInteraction === "dislike" ? "bg-red-100" : ""
              }`}
              onClick={() => handleLikeDislike("dislike")}
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
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {comment.student?.fullName ||
                        comment.professor?.fullName ||
                        comment.business?.companyName}
                      {comment.student
                        ? " ,Student"
                        : comment.professor
                        ? " ,Professor"
                        : " ,Business"}
                    </p>
                    <p>{comment.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-lg border bg-current focus:outline-none focus:ring-2 focus:ring-[#82CAFF] bg-ba"
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
