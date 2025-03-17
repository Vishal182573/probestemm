"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavbarWithBg } from "@/components/shared/NavbarWithbg";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ThumbsUp,
  ThumbsDown,
  Send,
  User2,
  Loader,
  ChevronRight,
  Share2,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { API_URL } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { BLOG, LOGO } from "../../../../public";
import Banner from "@/components/shared/Banner";
// import ContactForm from "@/components/shared/Feedback";
// import FeaturesDemo from "@/components/shared/TextImageComponent";

// Define TypeScript interfaces for data structures
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userType: "STUDENT" | "PROFESSOR" | "BUSINESS";
  student?: {
    id: string;
    fullName: string;
    imageUrl: string;
  };
  professor?: {
    id: string;
    fullName: string;
    title: string;
    photoUrl: string;
  };
  business?: {
    id: string;
    companyName: string;
    profileImageUrl: string;
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

interface RelatedBlog {
  id: string;
  title: string;
  blogImage: string;
}

interface User {
  id: string;
  role: "STUDENT" | "PROFESSOR" | "BUSINESS";
  fullName?: string; // For students and professors
  companyName?: string; // For businesses
  profileImageUrl?: string; // For user avatars
}

// Main BlogPostPage Component
const BlogPostPage = () => {
  // State management using React hooks
  // id: URL parameter for blog post identification
  // blogPost: Stores the current blog post data
  // relatedBlogs: Stores related blog posts
  // newComment: Manages comment input field
  // loading: Tracks main content loading state
  // commentLoading: Tracks comment submission loading state
  // error: Stores error messages
  // userInteraction: Tracks user's like/dislike status
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInteraction, setUserInteraction] = useState<
    "like" | "dislike" | null
  >(null);
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  // Effect hook to fetch initial data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchBlogPost();
      fetchUserInteraction();
      fetchRelatedBlogs();
    }
  }, [id]);

  // Fetch current user info on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Current user info:", response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Function to fetch the main blog post data
  const fetchBlogPost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      console.log(response.data);
      setBlogPost(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch blog post");
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch user's previous interaction (like/dislike) with the blog
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

  // Function to fetch related blog posts
  const fetchRelatedBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}/related`);
      setRelatedBlogs(response.data);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  // Function to check if the current user is the author of the blog
  const isUserBlogAuthor = () => {
    if (!currentUser || !blogPost) return false;
    
    if (blogPost.authorType === "PROFESSOR" && currentUser.id === blogPost.professor?.id) {
      return true;
    }
    
    if (blogPost.authorType === "BUSINESS" && currentUser.id === blogPost.business?.id) {
      return true;
    }
    
    return false;
  };

  // Function to check if the comment belongs to the current user
  const isUserComment = (comment: Comment) => {
    console.log(comment.userType, currentUser?.id, comment.student?.id);
    if (!currentUser) return false;
    
    if (comment.userType === "STUDENT" && currentUser.id === comment.student?.id) {
      return true;
    }
    
    if (comment.userType === "PROFESSOR" && currentUser.id === comment.professor?.id) {
      return true;
    }
    
    if (comment.userType === "BUSINESS" && currentUser.id === comment.business?.id) {
      return true;
    }
    
    return false;
  };

  // Handler for like/dislike functionality
  const handleLikeDislike = async (action: "like" | "dislike") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to interact with blogs",
          variant: "destructive",
          duration: 5000,
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

  // Handler for submitting new comments
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCommentLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Please log in to comment", variant: "destructive", duration: 5000});
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

  // Function to handle blog deletion
  const handleDeleteBlog = async () => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to delete this blog",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }
  
      await axios.delete(`${API_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast({ title: "Blog deleted successfully", duration: 5000, });
      router.push("/blogs"); // Redirect to blogs list
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({ 
        title: "Failed to delete blog", 
        description: "You can only delete blogs that you created.",
        variant: "destructive" ,
        duration: 5000,
      });
    }
  };

  // Update the handleDeleteComment function to include confirmation
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to delete comments",
          variant: "destructive",
          duration: 5000,
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
      toast({ 
        title: "Failed to delete comment", 
        description: "You can only delete your own comments.",
        variant: "destructive" 
      });
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to edit comments",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      await axios.put(
        `${API_URL}/blogs/${id}/comments/${commentId}`,
        { content: editedCommentContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              comments: prevPost.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, content: editedCommentContent }
                  : comment
              ),
            }
          : null
      );
      setEditingCommentId(null);
      setEditedCommentContent("");
      toast({ title: "Comment updated successfully" });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({ 
        title: "Failed to update comment", 
        description: "You can only edit your own comments.",
        variant: "destructive" 
      });
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eb5e17] to-[#686256] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Image src={LOGO} alt="logo" className="w-24" />
          <div className="text-[#472014] text-4xl font-caveat flex items-center">
            Loading blog post...
          </div>
        </main>
      </div>
    );
  }

  // Error state UI when blog post is not found
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eb5e17] to-[#686256] text-[#472014] flex flex-col items-center justify-center">
        <h1 className="text-[100px] font-bold mb-4 font-caveat">
          Blog post not found
        </h1>
        {error && <p className="text-red-500 text-xl">{error}</p>}
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation bar component */}
      <NavbarWithBg />

      {/* Banner section with blog header image */}
      <Banner
        imageSrc={BLOG}
        altText="webinar-banner-img"
        title="Thought-Provoking Perspectives"
        subtitle="Explore diverse opinions and ideas"
      />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main content section - Takes up 2/3 of the width on large screens */}
          <div className="w-full lg:w-2/3">
            {/* Blog post article with animation */}
            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 border-2 border-[#472014]/20 hover:border-[#472014] transition-all duration-300"
            >
              {/* Blog header section with title and author info */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-caveat font-bold text-[#472014]">
                  {blogPost?.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-base sm:text-lg text-[#eb5e17] font-semibold">
                    By {blogPost?.professor?.fullName || blogPost?.business?.companyName}
                  </p>
                  <p className="text-sm sm:text-base text-[#472014]/70">
                    {blogPost?.professor
                      ? `${blogPost.professor.title} at ${blogPost.professor.university}`
                      : blogPost?.business?.industry}
                  </p>
                </div>
              </div>

              {/* Blog content section with text and image */}
              <div className="my-6 space-y-6">
                <p className="text-base sm:text-lg text-[#472014] leading-relaxed">
                  {blogPost?.content}
                </p>
                {blogPost?.blogImage && (
                  <div className="relative w-full h-48 sm:h-64 lg:h-96">
                    <Image
                      src={blogPost.blogImage}
                      alt={blogPost.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* User interaction buttons (like, dislike, share) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  variant="default"
                  className={`flex items-center text-sm sm:text-base font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                    userInteraction === "like"
                      ? "bg-[#eb5e17] text-white"
                      : "bg-white hover:bg-[#eb5e17] hover:text-white"
                  }`}
                  onClick={() => handleLikeDislike("like")}
                >
                  <ThumbsUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{blogPost?.likes}</span>
                </Button>
                <Button
                  variant="default"
                  className={`flex items-center text-sm sm:text-base font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                    userInteraction === "dislike"
                      ? "bg-[#472014] text-white"
                      : "bg-white hover:bg-[#472014] hover:text-white"
                  }`}
                  onClick={() => handleLikeDislike("dislike")}
                >
                  <ThumbsDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{blogPost?.dislikes}</span>
                </Button>
                <Button
                  className="text-[#eb5e17] hover:text-white bg-white hover:bg-[#eb5e17] rounded-full transition-all duration-300 text-sm sm:text-base"
                  onClick={() => {
                    // Create the full URL to the current blog post
                    const blogUrl = `${window.location.origin}/blogs/${id}`;
                    
                    // Copy to clipboard
                    navigator.clipboard.writeText(blogUrl)
                      .then(() => {
                        toast({
                          title: "Link copied to clipboard",
                          description: "You can now share this blog with others.",
                          duration: 5000,
                        });
                      })
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                        toast({
                          title: "Failed to copy link",
                          variant: "destructive",
                          duration: 5000,
                        });
                      });
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Share
                </Button>
                {/* Add delete blog button that only shows for the blog author */}
                {isUserBlogAuthor() && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      onClick={() => router.push(`/create-blog?edit=${blogPost.id}`)}
                      className="text-white bg-[#472014] hover:bg-[#472014]/80 rounded-full transition-all duration-300 text-sm sm:text-base flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      Edit
                    </Button>
                    <Button
                      onClick={handleDeleteBlog}
                      className="text-white bg-red-500 hover:bg-red-700 rounded-full transition-all duration-300 text-sm sm:text-base"
                    >
                      <Trash2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Delete
                    </Button>
                  </div>
                  )}
              </div>
            </motion.article>

            {/* Comments section with animation */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-caveat font-bold mb-6 text-[#472014]">
                Comments
              </h2>
              
              {/* Comment form for new comments */}
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow p-3 rounded-lg border-2 border-[#eb5e17] focus:ring-[#472014] text-base bg-white text-[#472014]"
                />
                <Button
                  type="submit"
                  className="bg-[#eb5e17] hover:bg-[#472014] text-white font-bold px-4 sm:px-6 rounded-full transition-all duration-300"
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>

              {/* List of existing comments */}
              <ul className="space-y-6">
                {blogPost?.comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="border-b border-[#eb5e17]/20 pb-6 hover:bg-[#472014]/5 p-4 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-3 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#eb5e17] text-base sm:text-lg">
                            {comment.student?.fullName ||
                              comment.professor?.fullName ||
                              comment.business?.companyName}
                          </p>
                          <span className="text-sm text-[#472014]/70">
                            {comment.student
                              ? "(Student)"
                              : comment.professor
                              ? "(Professor)"
                              : "(Business)"}
                          </span>
                        </div>
                        {/* Show edit form if this comment is being edited */}
                        {editingCommentId === comment.id ? (
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEditComment(comment.id);
                          }} className="flex gap-3">
                            <Input
                              type="text"
                              value={editedCommentContent}
                              onChange={(e) => setEditedCommentContent(e.target.value)}
                              className="flex-grow p-3 rounded-lg border-2 text-base bg-white text-[#472014]"
                              autoFocus
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              className="bg-[#eb5e17] hover:bg-[#472014] text-white font-medium px-4 transition-all duration-300"
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedCommentContent("");
                              }}
                              variant="outline"
                              className="bg-[#eb5e17] hover:bg-[#472014] text-white font-medium px-4 transition-all duration-300"
                            >
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <p className="text-base text-[#472014]">{comment.content}</p>
                        )}
                        <div className="flex items-center gap-4 flex-wrap">
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
                              className="bg-[#eb5e17]/10 hover:bg-[#eb5e17] text-black hover:text-white rounded-full transition-all duration-300 text-sm"
                            >
                              <User2 size={16} className="mr-2" />
                              View Profile
                            </Button>
                          </Link>
                          <p className="text-sm text-[#686256]">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                          {/* Add edit and delete buttons that show only for user's own comments */}
                          {isUserComment(comment) && (
                            <div className="ml-auto flex gap-2">
                              {/* {editingCommentId !== comment.id && ( */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditedCommentContent(comment.content);
                                  }}
                                  className="bg-[#472014]/10 hover:bg-[#472014] text-[#472014] hover:text-white rounded-full transition-all duration-300 text-sm"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                  </svg>
                                  Edit
                                </Button>
                              {/* )} */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded-full transition-all duration-300 text-sm"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Sidebar section - Takes up 1/3 of the width on large screens */}
          <div className="w-full lg:w-1/3">
            {/* Related blogs sidebar with animation */}
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-4 sm:p-6 sticky top-24"
            >
              <h2 className="text-xl sm:text-2xl font-caveat font-bold mb-6 text-[#472014]">
                More Blogs
              </h2>
              <div className="grid gap-4">
                {relatedBlogs.map((blog) => (
                  <Link href={`/blogs/${blog.id}`} key={blog.id}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#eb5e17]/10 transition-all duration-300">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={blog.blogImage || "/placeholder-image.jpg"}
                          alt={blog.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-[#472014] text-sm sm:text-base line-clamp-2">
                        {blog.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
              <Button
                className="w-full mt-6 bg-[#eb5e17] hover:bg-[#472014] text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
                onClick={() => router.push("/blogs")}
              >
                View More Blogs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;