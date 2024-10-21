"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaClock,
  FaComment,
} from "react-icons/fa";
import { Footer } from "@/components/shared/Footer";
import axios from "axios";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";

import Link from "next/link";
import { LucideUserCheck, Rocket } from "lucide-react";
import { CONTACT, LOGO } from "../../../../public";
import Image from "next/image";
import Banner from "@/components/shared/Banner"; 
import ContactForm from "@/components/shared/Feedback";
import FeaturesDemo from "@/components/shared/TextImageComponent";

interface Answer {
  id: string;
  content: string;
  createdAt: string;
  professor?: { fullName: string; id: string };
  business?: { companyName: string; id: string };
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  student: { name: string };
  answers: Answer[];
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscussion();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/discussion/${id}`);
      setDiscussion(response.data);
    } catch {
      setError("Failed to fetch discussion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnswer = async () => {
    if (newAnswer.trim() !== "") {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          setError("User not found in localStorage");
          return;
        }
        const user = JSON.parse(userString);
        await axios.post(`${API_URL}/discussion/answer`, {
          content: newAnswer,
          discussionId: id,
          userType: localStorage.getItem("role"), // or 'BUSINESS', depending on the user type
          userId: user.id, // Replace with actual user ID
        });
        setNewAnswer("");
        fetchDiscussion(); // Refetch to update the answers list
      } catch {
        setError("Failed to post answer");
      }
    }
  };

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    try {
      await axios.post("/api/discussions/vote", {
        discussionId: id,
        userId: "current-user-id", // Replace with actual user ID
        userType: "STUDENT", // Replace with actual user type
        voteType,
      });
      fetchDiscussion(); // Refetch to update the vote count
    } catch {
      setError("Failed to vote");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-[#472014] font-caveat text-2xl">
        <Image src={LOGO} alt="logo" className="w-36"/>
          <Rocket className="h-8 w-8 r-2 mr-2 text-[#c1502e]" />
          Loading discussion...
        </p>
      </div>
    );
  }
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!discussion)
    return (
      <div className="flex justify-center items-center h-screen text-[#472014]">
        Discussion not found
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <NavbarWithBg />
      <Banner imageSrc={CONTACT} altText="discuccions-id-img" title="discussion" subtitle="discussion-idse"/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold mb-8 text-[#472014] font-caveat"
        >
          {discussion.title}
        </motion.h1>

        <Card className="mb-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-[#c1502e]">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  className="px-2 py-1 mb-2 text-[#c1502e] hover:text-[#472014] border-[#c1502e]"
                  onClick={() => handleVote("UPVOTE")}
                >
                  <FaArrowUp />
                </Button>
                <span className="text-sm font-medium text-[#472014]">
                  {discussion.upvotes - discussion.downvotes}
                </span>
                <Button
                  variant="outline"
                  className="px-2 py-1 mt-2 text-[#c1502e] hover:text-[#472014] border-[#c1502e]"
                  onClick={() => handleVote("DOWNVOTE")}
                >
                  <FaArrowDown />
                </Button>
              </div>
              <div className="flex-grow">
                <p className="text-lg mb-4 text-[#472014]">
                  {discussion.description}
                </p>
                <div className="flex items-center text-sm text-[#686256]">
                  <FaUser className="mr-1" />
                  <span>{discussion.student.name}</span>
                  <span className="mx-2">•</span>
                  <FaClock className="mr-1" />
                  <span>{new Date(discussion.createdAt).toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-[#c1502e] text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {discussion.category}
                  </span>
                  <span className="bg-[#472014] text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {discussion.subcategory}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold mb-4 text-[#472014] font-caveat"
        >
          {discussion.answers.length} Answers
        </motion.h2>

        {discussion.answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#c1502e]">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <p className="text-lg mb-4 text-[#472014]">
                      {answer.content}
                    </p>
                    <div className="flex items-center text-sm text-[#686256]">
                      <FaUser className="mr-1" />
                      <span>
                        {answer.professor
                          ? `Professor: ${answer.professor.fullName}`
                          : answer.business
                          ? `Business: ${answer.business.companyName ?? ""}`
                          : ""}
                      </span>
                      <span className="mx-2">•</span>
                      <FaClock className="mr-1" />
                      <span>{new Date(answer.createdAt).toLocaleString()}</span>
                      <div className="flex items-center ml-4">
                        <Link
                          href={
                            answer.professor
                              ? `/professor-profile/${answer.professor.id} `
                              : `/business-profile/${answer.business?.id ?? ""}`
                          }
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white bg-[#c1502e] hover: rounded-full transition-all duration-300 shadow-lg hover:shadow-xl space-x-3"
                          >
                            <LucideUserCheck size={18} />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {(userRole === "professor" || userRole === "business") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#472014] font-caveat">
              Your Answer
            </h3>
            <Textarea
              placeholder="Write your answer here..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full mb-4 bg-white text-[#472014] border-[#c1502e] focus:border-[#472014] focus:ring focus:ring-[#c1502e] focus:ring-opacity-50"
              rows={6}
            />
            <Button
              onClick={handleAddAnswer}
              className="bg-[#c1502e] hover:bg-[#472014] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-xl flex items-center"
            >
              <FaComment className="mr-2" /> Post Answer
            </Button>
          </motion.div>
        )}
      </motion.div>
      <FeaturesDemo/>
      <ContactForm/>
      <Footer />
    </div>
  );
};

export default QuestionDetailPage;
