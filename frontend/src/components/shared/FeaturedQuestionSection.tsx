import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaArrowUp, FaUser, FaClock, FaComment } from "react-icons/fa";

interface FeaturedQuestion {
  id: string;
  title: string;
  content: string;
  author: string;
  time: string;
  votes: number;
  commentCount: number;
}

const FeaturedQuestionsSection: React.FC = () => {
  const featuredQuestions: FeaturedQuestion[] = [
    {
      id: "1",
      title: "What are the latest advancements in quantum computing?",
      content:
        "I'm curious about the recent developments in quantum computing. Can someone provide an overview of the most significant breakthroughs?",
      author: "QuantumExplorer",
      time: "2 hours ago",
      votes: 25,
      commentCount: 8,
    },
    {
      id: "2",
      title: "How does machine learning impact modern robotics?",
      content:
        "I'm researching the intersection of ML and robotics. What are some key ways machine learning is enhancing robotic systems?",
      author: "RoboEnthusiast",
      time: "1 day ago",
      votes: 42,
      commentCount: 15,
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-6 sm:mb-8 md:mb-12 text-[#472014] font-caveat"
        >
          Featured Discussions
        </motion.h2>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {featuredQuestions.map((question) => (
            <motion.div key={question.id} variants={itemVariants}>
              <Card className="bg-white border border-[#c1502e] hover:border-[#472014] transition-colors duration-300 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex sm:flex-col items-center space-x-2 sm:space-x-0">
                      <Button
                        variant="outline"
                        className="px-2 py-1 sm:mb-2 hover:bg-[#c1502e] hover:text-white transition-colors duration-300"
                      >
                        <FaArrowUp className="text-white hover:text-[#472014]" />
                      </Button>
                      <span className="text-sm font-medium text-[#472014]">
                        {question.votes}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#472014]">
                        {question.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#686256] mb-4">
                        {question.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#686256]">
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{question.author}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{question.time}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center">
                          <FaComment className="mr-1" />
                          <span>{question.commentCount} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Link href="/discussions">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full sm:w-auto bg-[#c1502e] hover:bg-[#472014] text-white text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors duration-300">
                View All Discussions
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedQuestionsSection;