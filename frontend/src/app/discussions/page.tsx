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
  FaSearch,
  FaPlus,
  FaSort,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaComment,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/shared/Footer";
import axios from "axios";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

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
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

const categories: { [key: string]: string[] } = {
  Science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Earth Sciences",
    "Space Science",
  ],
  Technology: ["Computer Science", "Engineering"],
  Engineering: [
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
  ],
  Mathematics: ["Pure Mathematics", "Applied Mathematics"],
  "Engineering Technology": [
    "Data Engineering",
    "Robotics",
    "Biotechnology",
    "Environmental Technology",
    "Space Technology",
    "Pharmaceutical Engineering",
  ],
};

const DiscussionForum: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDiscussions();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [sortBy, status, category, subcategory, pagination.currentPage]);

  const fetchDiscussions = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchDiscussions();
  };

  const handleVote = async (
    discussionId: string,
    voteType: "UPVOTE" | "DOWNVOTE"
  ) => {
    try {
      await axios.post(`${API_URL}/discussion/vote`, {
        discussionId,
        userId: "currentUserId", // Replace with actual user ID
        userType: "STUDENT", // Replace with actual user type
        voteType,
      });
      fetchDiscussions(); // Refresh discussions after voting
    } catch (error) {
      console.error("Failed to vote on discussion:", error);
    }
  };

  const handleQuestionClick = (questionId: string) => {
    router.push(`/discussions/${questionId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarWithBg/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-4 sm:p-6 md:p-8"
      >

        <motion.div
          className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6 md:mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-grow mb-4 sm:mb-0">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#686256]" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white text-[#472014] border-[#c1502e]"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-[#c1502e] hover:bg-[#472014] text-white rounded-full"
          >
            Search
          </Button>

          {userRole === "student" && (
            <Button
              onClick={() => router.push("/ask-question")}
              className="bg-[#c1502e] hover:bg-[#472014] text-white flex items-center mb-4 sm:mb-0 rounded-full"
            >
              <FaPlus className="mr-2" /> Ask Question
            </Button>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-white text-gray-800">
                <FaSort className="mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="mostVoted">Most votes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-white text-gray-800">
                <FaFilter className="mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="open">Unanswered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setSubcategory(undefined);
              }}
            >
              <SelectTrigger className="w-full bg-white text-gray-800">
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
          </div>
          <div className="flex-1">
            <Select
              value={subcategory}
              onValueChange={setSubcategory}
              disabled={!category}
            >
              <SelectTrigger className="w-full bg-white text-gray-800">
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

        <AnimatePresence>
          {discussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white border border-[#c1502e]"
                onClick={() => handleQuestionClick(discussion.id)}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start space-x-4">
                  <div className="flex flex-col items-center mb-4 sm:mb-0">
                    <Button
                      variant="outline"
                      className="px-2 py-1 mb-2 hover:bg-[#c1502e] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion.id, "UPVOTE");
                      }}
                    >
                      <FaArrowUp className="text-white" />
                    </Button>
                    <span className="text-sm font-medium text-[#472014]">
                      {discussion.upvotes - discussion.downvotes}
                    </span>
                    <Button
                      variant="outline"
                      className="px-2 py-1 mt-2 hover:bg-[#c1502e] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion.id, "DOWNVOTE");
                      }}
                    >
                      <FaArrowDown className="text-white" />
                    </Button>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#472014]">
                      {discussion.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start text-sm text-[#686256] space-y-1 sm:space-y-0 sm:space-x-2">
                      <div className="flex items-center">
                        <FaUser className="mr-1" />
                        <span>{discussion.studentName}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>
                          {new Date(discussion.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div
                        className={`flex items-center ${
                          discussion.status === "ANSWERED"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        <span>
                          {discussion.status === "ANSWERED"
                            ? "Answered"
                            : "Unanswered"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaComment className="mr-1" />
                        <span>{discussion.answerCount} answers</span>
                      </div>
                      <div className="flex items-center">
                        <span>
                          {discussion.category} - {discussion.subcategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pagination controls */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="mr-2 bg-[#c1502e] hover:bg-[#472014] text-white rounded-full"
          >
            Previous
          </Button>
          <span className="mx-4 text-[#472014]">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="ml-2 bg-[#c1502e] hover:bg-[#472014] text-white rounded-full"
          >
            Next
          </Button>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default DiscussionForum;