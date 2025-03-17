/* eslint-disable @typescript-eslint/no-explicit-any */ 
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FaSearch,
  FaPlus,
  FaSort,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaComment,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/constants";
import axios from "axios";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import Banner from "@/components/shared/Banner";
import { DISCUSSION } from "../../../public";
// import FeaturesDemo from "@/components/shared/TextImageComponent";
// import ContactForm from "@/components/shared/Feedback";
import { Footer } from "@/components/shared/Footer";
import { ProjectCategories } from "@/lib/pre-define-data";

// Interface definitions for Discussion and Pagination data structures
interface Discussion {
  id: string;
  title: string;
  studentName: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  status: "OPEN" | "ANSWERED";
  answerCount: number;
  category: string;
  subcategory: string;
  studentId: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

// Category and subcategory mapping object - defines the hierarchical structure of academic subjects
const categories = ProjectCategories as Record<string, string[]>;

// Main Discussion Forum Component
const DiscussionForum: React.FC = () => {
  // State management for filters, search, and data
  const [searchQuery, setSearchQuery] = useState("");  // Stores search input value
  const [sortBy, setSortBy] = useState("recent");      // Controls sorting order
  const [status, setStatus] = useState("all");         // Filters by discussion status
  const [category, setCategory] = useState<string | undefined>(undefined);     // Selected main category
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined); // Selected subcategory
  const [discussions, setDiscussions] = useState<Discussion[]>([]); // Stores fetched discussions

  // Pagination state management
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // User role state for conditional rendering
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch discussions from the API with current filters
  const fetchDiscussions = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const params: any = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        sortBy,
        status: status !== "all" ? status.toUpperCase() : undefined,
        category,
        subcategory,
        searchString: searchQuery,
      };

      const response = await axios.get(`${API_URL}/discussion/search`, {
        params,
      });
      setDiscussions(response.data.discussions);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    }
  };

  // Effect hook to fetch discussions when filters change
  useEffect(() => {
    fetchDiscussions();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [sortBy, status, category, subcategory, pagination.currentPage, fetchDiscussions]);

  // Handler for search button click
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchDiscussions();
  };

  // Handler for upvote/downvote actions
  const handleVote = async (
    discussionId: string,
    voteType: "UPVOTE" | "DOWNVOTE"
  ) => {
    try {
      await axios.post(`${API_URL}/discussion/vote`, {
        discussionId,
        userId: localStorage.getItem("userId"),
        userType: localStorage.getItem("role")?.toUpperCase(),
        voteType,
      });
      fetchDiscussions(); // Refresh discussions after voting
    } catch (error) {
      console.error("Failed to vote on discussion:", error);
    }
  };

  // const handleQuestionClick = (questionId: string) => {
  //   router.push(`/discussions/${questionId}`);
  // };

  // Handler for pagination page changes
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation and Banner Section */}
      <NavbarWithBg />
      <Banner
        imageSrc={DISCUSSION}
        altText="discussion-banner"
        title="Insightful Discussions"
        subtitle="Connect with experts and peers"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8 md:py-12"
      >
        {/* Search and Ask Question Section - Allows users to search discussions and create new ones */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#686256]" />
              <Input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-white text-[#472014] border-[#eb5e17] rounded-full shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSearch}
                className="bg-[#eb5e17] hover:bg-[#472014] text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Search
              </Button>
              {userRole === "student" && (
                <Button
                  onClick={() => router.push("/ask-question")}
                  className="bg-[#472014] hover:bg-[#eb5e17] text-white rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FaPlus /> Ask Question
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters Section - Contains dropdowns for sorting, status, category, and subcategory filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-white text-gray-800 border-[#eb5e17] rounded-xl hover:border-[#472014] transition-colors">
                <div className="flex items-center gap-2">
                  <FaSort className="text-[#eb5e17]" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="mostVoted">Most votes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-white text-gray-800 border-[#eb5e17] rounded-xl hover:border-[#472014] transition-colors">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-[#eb5e17]" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="open">Unanswered</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setSubcategory(undefined);
              }}
            >
              <SelectTrigger className="w-full bg-white text-gray-800 border-[#eb5e17] rounded-xl hover:border-[#472014] transition-colors">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={subcategory}
              onValueChange={setSubcategory}
              disabled={!category}
            >
              <SelectTrigger className="w-full bg-white text-gray-800 border-[#eb5e17] rounded-xl hover:border-[#472014] transition-colors">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {category &&
                  categories[category].map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Discussions List - Displays discussion cards with voting, metadata, and navigation */}
        <AnimatePresence>
          {discussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/discussions/${discussion.id}`}>
                <Card className="mb-4 hover:shadow-xl transition-all duration-300 bg-white border-[#eb5e17] rounded-xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Voting Section */}
                      <TooltipProvider>
                        <div className="flex flex-col items-center space-y-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-12 h-12 rounded-xl bg-[#f8f0ea] hover:bg-[#eb5e17] group-hover:border-[#eb5e17] transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleVote(discussion.id, "UPVOTE");
                                }}
                              >
                                <FaArrowUp className="text-[#472014] group-hover:text-black transition-colors" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upvote this discussion</TooltipContent>
                          </Tooltip>

                          <span className="text-lg font-semibold text-[#472014]">
                            {discussion.upvotes - discussion.downvotes}
                          </span>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-12 h-12 rounded-xl bg-[#f8f0ea] hover:bg-[#eb5e17] group-hover:border-[#eb5e17] transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleVote(discussion.id, "DOWNVOTE");
                                }}
                              >
                                <FaArrowDown className="text-[#472014] group-hover:text-black transition-colors" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Downvote this discussion</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>

                      {/* Content Section */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-[#472014] group-hover:text-[#eb5e17] transition-colors">
                            {discussion.title}
                          </h3>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/student-profile/${discussion.studentId}`);
                            }}
                            variant="ghost"
                            className="flex items-center gap-2 text-[#472014] hover:text-[#eb5e17] transition-colors"
                          >
                            <FaUserCircle className="text-lg" />
                            <span className="font-medium">{discussion.studentName}</span>
                          </Button>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-4 text-sm text-[#686256] mb-4">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-[#eb5e17]" />
                            <span>{new Date(discussion.createdAt).toLocaleString()}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${
                            discussion.status === "ANSWERED" 
                              ? "text-green-600" 
                              : "text-blue-600"
                          }`}>
                            <span className="px-3 py-1 rounded-full bg-opacity-20 font-medium">
                              {discussion.status === "ANSWERED" ? "Answered" : "Unanswered"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaComment className="text-[#eb5e17]" />
                            <span>{discussion.answerCount} answers</span>
                          </div>
                        </div>

                        {/* Category Tags */}
                        <div className="flex gap-2">
                          <span className="px-4 py-1.5 bg-[#f8f0ea] text-[#472014] rounded-full text-sm font-medium hover:bg-[#eb5e17] hover:text-white transition-colors">
                            {discussion.category}
                          </span>
                          <span className="px-4 py-1.5 bg-[#f8f0ea] text-[#472014] rounded-full text-sm font-medium hover:bg-[#eb5e17] hover:text-white transition-colors">
                            {discussion.subcategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pagination Controls - Allows navigation between pages of discussions */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="bg-[#f8f0ea] hover:bg-[#eb5e17] text-[#472014] hover:text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
          >
            <FaChevronLeft />
            Previous
          </Button>
          
          <div className="px-4 py-2 bg-white rounded-xl shadow text-[#472014] font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <Button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="bg-[#f8f0ea] hover:bg-[#eb5e17] text-[#472014] hover:text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
          >
            Next
            <FaChevronRight />
          </Button>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default DiscussionForum;