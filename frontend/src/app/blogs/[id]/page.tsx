"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NavbarWithBg } from "@/components/shared/NavbarWithbg";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Send, Trash, User2, Loader } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { API_URL } from "@/constants";
import Link from "next/link";
import Image from "next/image";

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
  blogImage: string;
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
  const [commentLoading, setCommentLoading] = useState(false);
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

      const response = await axios.post(
        `${API_URL}/blogs/${id}/toggle-like`,
        { isLike: action === "like" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Interaction removed") {
        setUserInteraction(null);
      } else {
        setUserInteraction(action);
      }

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
      setCommentLoading(true);
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
          ? { ...prevPost, comments: [response.data, ...prevPost.comments] }
          : null
      );
      setNewComment("");
      toast({ title: "Comment added successfully" });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({ title: "Failed to add comment", variant: "destructive" });
    } finally {
      setCommentLoading(false);
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
      <div className="min-h-screen bg-gradient-to-b from-[#c1502e] to-[#686256] flex flex-col">
        <NavbarWithBg />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-[#472014] text-4xl font-caveat flex items-center">
            Loading blog post...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#c1502e] to-[#686256] text-[#472014] flex flex-col items-center justify-center">
        <h1 className="text-[100px] font-bold mb-4 font-caveat">
          Blog post not found
        </h1>
        {error && <p className="text-red-500 text-xl">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavbarWithBg />
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-8 mb-8 border-[2px] border-[#472014]"
        >
          <h1 className="text-4xl font-caveat font-bold mb-4 text-[#472014]">
            {blogPost.title}
          </h1>
          <p className="text-lg text-[#c1502e] font-semibold mb-6">
            By {blogPost.professor?.fullName || blogPost.business?.companyName},{" "}
            {blogPost.professor
              ? `${blogPost.professor.title} at ${blogPost.professor.university}`
              : `${blogPost.business?.industry}`}
          </p>
          <p className="text-lg mb-8 text-[#472014]">{blogPost.content}</p>
          {blogPost.blogImage && (
            <Image
              src={blogPost.blogImage}
              alt={blogPost.title}
              width={300}
              height={200}
              className="mb-4 rounded-lg"
            />
          )}

          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className={`flex items-center text-lg font-semibold px-6 py-3 rounded-full transition-all duration-300 ${
                userInteraction === "like"
                  ? "bg-[#c1502e] text-white"
                  : "bg-white hover:bg-[#c1502e] hover:text-white"
              }`}
              onClick={() => handleLikeDislike("like")}
            >
              <ThumbsUp className="mr-2" size={20} />
              {blogPost.likes}
            </Button>
            <Button
              variant="default"
              className={`flex items-center text-lg font-semibold px-6 py-3 rounded-full transition-all duration-300 ${
                userInteraction === "dislike"
                  ? "bg-[#472014] text-white"
                  : "bg-white hover:bg-[#472014] hover:text-white"
              }`}
              onClick={() => handleLikeDislike("dislike")}
            >
              <ThumbsDown className="mr-2" size={20} />
              {blogPost.dislikes}
            </Button>
            <Button className="text-[#c1502e] hover:text-white bg-white hover:bg-[#c1502e] rounded-full transition-all duration-300">
              <Link
                href={
                  blogPost.professor
                    ? `/professor-profile/${blogPost.professor.id}`
                    : `/business-profile/${blogPost.business?.id ?? ""}`
                }
              >
                View blog author profile
              </Link>
            </Button>
          </div>
        </motion.article>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-8"
        >
          <h2 className="text-4xl font-caveat font-bold mb-8 text-[#472014]">
            Comments
          </h2>
          <form onSubmit={handleCommentSubmit} className="flex space-x-4 mb-8">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-4 rounded-lg border-2 border-[#c1502e] focus:ring-[#472014] text-lg bg-white text-[#472014]"
            />
            <Button
              type="submit"
              className="bg-[#c1502e] hover:bg-[#472014] text-white font-bold px-6 py-3 rounded-full transition-all duration-300"
              disabled={commentLoading}
            >
              {commentLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </form>
          <ul className="space-y-6">
            {blogPost.comments.map((comment) => (
              <li
                key={comment.id}
                className="border-b border-[#c1502e]/20 pb-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-[#c1502e] text-lg">
                      {comment.student?.fullName ||
                        comment.professor?.fullName ||
                        comment.business?.companyName}
                      <span className="text-[#472014] ml-2">
                        {comment.student
                          ? "(Student Profile)"
                          : comment.professor
                          ? "(Professor Profile)"
                          : "(Business Profile)"}
                      </span>
                    </p>
                    <p className="text-lg text-[#472014] my-2">
                      {comment.content}
                    </p>
                    <Link
                      href={
                        comment.student
                          ? `/student-profile/${comment.student.id}`
                          : comment.professor
                          ? `/professor-profile/${comment.professor.id}`
                          : `/business-profile/${comment.business?.id ?? ""}`
                      }
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className=" bg-[#c1502e] hover:text-white rounded-full transition-all duration-300"
                      >
                        <User2 size={18} className="mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <p className="text-sm text-[#686256]">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" text-red-700 hover:bg-[#c1502e] hover:text-white rounded-full transition-all duration-300"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
