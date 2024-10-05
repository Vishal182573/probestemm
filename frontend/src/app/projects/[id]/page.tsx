"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUserTie, FaCalendarAlt, FaClipboardCheck, FaComments, FaPaperPlane } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';

interface Project {
  id: string;
  title: string;
  description: string;
  professor: {
    name: string;
    expertise: string;
    email: string;
  };
  status: 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string | null;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  comments: {
    id: string;
    author: string;
    content: string;
    date: string;
  }[];
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch project details from API
    // For now, we'll use mock data
    setProject({
      id: '1',
      title: 'AI-driven Customer Service',
      description: 'Developing an AI chatbot for customer support to improve response times and customer satisfaction.',
      professor: {
        name: 'Dr. Jane Smith',
        expertise: 'Artificial Intelligence',
        email: 'jane.smith@university.edu'
      },
      status: 'In Progress',
      startDate: '2023-09-01',
      endDate: null,
      tasks: [
        { id: 't1', title: 'Requirements gathering', completed: true },
        { id: 't2', title: 'Data collection and preprocessing', completed: true },
        { id: 't3', title: 'Model development', completed: false },
        { id: 't4', title: 'Integration and testing', completed: false },
      ],
      comments: [
        { id: 'c1', author: 'Business Admin', content: 'Great progress on the initial phases!', date: '2023-09-15' },
        { id: 'c2', author: 'Dr. Jane Smith', content: 'We\'re currently fine-tuning the NLP model.', date: '2023-09-20' },
      ]
    });
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim() !== '' && project) {
      const updatedProject = {
        ...project,
        comments: [
          ...project.comments,
          {
            id: `c${Date.now()}`,
            author: 'Business Admin',
            content: newComment,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      setProject(updatedProject);
      setNewComment('');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <>
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
        className="text-4xl font-bold mb-8"
      >
        {project.title}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="mr-2 text-blue-600" />
                <span>Start Date: {project.startDate}</span>
              </div>
              {project.endDate && (
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  <span>End Date: {project.endDate}</span>
                </div>
              )}
              <div className="flex items-center">
                <FaClipboardCheck className="mr-2 text-blue-600" />
                <span className={`font-semibold ${
                  project.status === 'In Progress' ? 'text-yellow-600' :
                  project.status === 'Completed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Status: {project.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="mr-2"
                    />
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaUserTie className="mr-2" /> Assigned Professor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">{project.professor.name}</h3>
              <p className="text-gray-600 mb-2">{project.professor.expertise}</p>
              <a href={`mailto:${project.professor.email}`} className="text-blue-600 hover:underline">
                {project.professor.email}
              </a>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaComments className="mr-2" /> Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-4">
                {project.comments.map((comment) => (
                  <li key={comment.id} className="border-b pb-2">
                    <p className="font-semibold">{comment.author}</p>
                    <p className="text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-400">{comment.date}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mb-2"
                />
                <Button
                  onClick={handleAddComment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                >
                  <FaPaperPlane className="mr-2" /> Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
    <Footer/>
    </>
  );
};

export default ProjectDetailPage;