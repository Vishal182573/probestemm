"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowUp, FaArrowDown, FaUser, FaClock, FaComment } from "react-icons/fa";
import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  time: string;
  votes: number;
  answered: boolean;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  time: string;
  votes: number;
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    // Fetch question and answers from API
    // For now, we'll use mock data
    setQuestion({
      id: "1",
      title: "What are the fundamental principles of quantum mechanics?",
      content: "I'm studying quantum mechanics and I'm having trouble understanding the core principles. Can someone explain them in simple terms?",
      author: "Dr. Smith",
      time: "7 hours ago",
      votes: 15,
      answered: true,
    });

    setAnswers([
      {
        id: "a1",
        content: "The fundamental principles of quantum mechanics include:\n\n1. Superposition\n2. Uncertainty\n3. Wave-particle duality\n4. Quantization\n5. Entanglement",
        author: "Prof. Johnson",
        time: "5 hours ago",
        votes: 10,
      },
      // ... more answers
    ]);
  }, [id]);

  const handleAddAnswer = () => {
    if (newAnswer.trim() !== "") {
      const newAnswerObj: Answer = {
        id: `a${Date.now()}`,
        content: newAnswer,
        author: "Current User",
        time: "Just now",
        votes: 0,
      };
      setAnswers([...answers, newAnswerObj]);
      setNewAnswer("");
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="bg-[#82CAFF] min-h-screen">
      <Navbar/>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="container mx-auto p-8"
      >
        <motion.h1 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 text-gray-800"
        >
          {question.title}
        </motion.h1>

        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <Button variant="outline" className="px-2 py-1 mb-2">
                  <FaArrowUp className="text-blue-600" />
                </Button>
                <span className="text-sm font-medium text-gray-800">{question.votes}</span>
                <Button variant="outline" className="px-2 py-1 mt-2">
                  <FaArrowDown className="text-red-600" />
                </Button>
              </div>
              <div className="flex-grow">
                <p className="text-lg mb-4 text-gray-800">{question.content}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <FaUser className="mr-1" />
                  <span>{question.author}</span>
                  <span className="mx-2">•</span>
                  <FaClock className="mr-1" />
                  <span>{question.time}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-4 text-gray-800"
        >
          {answers.length} Answers
        </motion.h2>

        {answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="mb-4 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <Button variant="outline" className="px-2 py-1 mb-2">
                      <FaArrowUp className="text-blue-600" />
                    </Button>
                    <span className="text-sm font-medium text-gray-800">{answer.votes}</span>
                    <Button variant="outline" className="px-2 py-1 mt-2">
                      <FaArrowDown className="text-red-600" />
                    </Button>
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg mb-4 text-gray-800">{answer.content}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-1" />
                      <span>{answer.author}</span>
                      <span className="mx-2">•</span>
                      <FaClock className="mr-1" />
                      <span>{answer.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Answer</h3>
          <Textarea
            placeholder="Write your answer here..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full mb-4 bg-white text-gray-800"
            rows={6}
          />
          <Button
            onClick={handleAddAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <FaComment className="mr-2" /> Post Answer
          </Button>
        </motion.div>
      </motion.div>
      <Footer/>
    </div>
  );
};

export default QuestionDetailPage;