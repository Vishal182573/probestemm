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
import Banner from "@/components/shared/Banner";
import { BLOG } from "../../../public";
// import ContactForm from "@/components/shared/Feedback";
// import FeaturesDemo from "@/components/shared/TextImageComponent";

interface Author {
  id: string;
  fullName?: string;
  title?: string;
  university?: string;
  companyName?: string;
}

interface UserInteraction {
  isLike: boolean | null;
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
  const [userInteractions, setUserInteractions] = useState<{
    [key: string]: UserInteraction;
  }>({});
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
      fetchUserInteractions(response.data.map((blog: Blog) => blog.id));
      setError("");
    } catch (error) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInteractions = async (blogIds: string[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const interactions = await Promise.all(
        blogIds.map(async (blogId) => {
          const response = await axios.get(
            `${API_URL}/blogs/${blogId}/user-interactions`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return { blogId, interaction: response.data };
        })
      );

      const interactionsObject = interactions.reduce(
        (acc, { blogId, interaction }) => {
          acc[blogId] = interaction;
          return acc;
        },
        {} as { [key: string]: UserInteraction }
      );

      setUserInteractions(interactionsObject);
    } catch (error) {
      console.error("Error fetching user interactions:", error);
    }
  };

  const handleLikeToggle = async (blogId: string, isLike: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please log in to interact with blogs",
          variant: "destructive",
        });
        return;
      }

      await axios.post(
        `${API_URL}/blogs/${blogId}/toggle-like`,
        { isLike },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => {
          if (blog.id === blogId) {
            const currentInteraction = userInteractions[blogId];
            if (currentInteraction?.isLike === isLike) {
              // Remove the like/dislike
              return {
                ...blog,
                likes: isLike ? blog.likes - 1 : blog.likes,
                dislikes: !isLike ? blog.dislikes - 1 : blog.dislikes,
              };
            } else {
              // Toggle the like/dislike
              return {
                ...blog,
                likes: isLike
                  ? blog.likes + 1
                  : currentInteraction?.isLike
                  ? blog.likes - 1
                  : blog.likes,
                dislikes: !isLike
                  ? blog.dislikes + 1
                  : currentInteraction?.isLike === false
                  ? blog.dislikes - 1
                  : blog.dislikes,
              };
            }
          }
          return blog;
        })
      );

      setUserInteractions((prev) => ({
        ...prev,
        [blogId]: { isLike: prev[blogId]?.isLike === isLike ? null : isLike },
      }));

      toast({
        title: isLike
          ? "Blog liked successfully"
          : "Blog disliked successfully",
      });
    } catch (error) {
      console.error("Error toggling blog like:", error);
      toast({
        title: "Failed to update blog interaction",
        variant: "destructive",
      });
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
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="text-black text-xl sm:text-2xl font-caveat flex items-center">
            <Rocket className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-[#eb5e17]" />
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
      <Banner
        imageSrc={BLOG}
        altText="webinar-banner-img"
        title="Insights and Perspectives"
        subtitle="Stay up-to-date with the latest trends."
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8 text-[#472014] font-caveat text-center sm:text-left"
        >
          Probe STEM Blogs
        </motion.h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {blogs.map((blog) => {
            const authorInfo = getAuthorInfo(blog);
            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border-2 border-[#eb5e17] flex flex-col"
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#472014] font-caveat line-clamp-2">
                  {blog.title}
                </h2>
                <div className="text-sm sm:text-base">
                  <p className="text-[#686256] mb-1 sm:mb-2">
                    By {authorInfo.name}
                    {authorInfo.title && `, ${authorInfo.title}`}
                  </p>
                  <p className="text-[#686256] mb-2 sm:mb-4">{authorInfo.affiliation}</p>
                </div>
                {blog.blogImage && (
                  <div className="relative w-full aspect-video mb-4">
                    <Image
                      src={blog.blogImage}
                      alt={blog.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-[#472014] mb-4 sm:mb-6 text-sm sm:text-base line-clamp-3">
                  {blog.content}
                </p>
                <div className="mt-auto">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between sm:items-center">
                    <div className="flex space-x-2 sm:space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          userInteractions[blog.id]?.isLike === true
                            ? "text-blue-500"
                            : "text-[#eb5e17]"
                        } hover:text-white text-xs sm:text-sm`}
                        onClick={() => handleLikeToggle(blog.id, true)}
                      >
                        <ThumbsUp className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {blog.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          userInteractions[blog.id]?.isLike === false
                            ? "text-red-500"
                            : "text-[#eb5e17]"
                        } hover:text-white text-xs sm:text-sm`}
                        onClick={() => handleLikeToggle(blog.id, false)}
                      >
                        <ThumbsDown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        {blog.dislikes}
                      </Button>
                    </div>
                    <div className="flex gap-2 sm:gap-4">
                      <Link href={`/blogs/${blog.id}`} className="flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#eb5e17] bg-[#472014] text-white text-xs sm:text-sm whitespace-nowrap"
                        >
                          <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          {blog.comments.length}
                        </Button>
                      </Link>
                      <Link
                        href={
                          blog.professor
                            ? `/professor-profile/${blog.professor.id}`
                            : `/business-profile/${blog.business?.id}`
                        }
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-white bg-[#eb5e17] hover:bg-[#472014] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                        >
                          <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {blog.professor?.fullName || blog.business?.companyName}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          {(userRole === "professor" || userRole === "business") && (
            <Link href="/create-blog">
              <Button
                variant="default"
                size="lg"
                className="bg-[#eb5e17] hover:bg-[#472014] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
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