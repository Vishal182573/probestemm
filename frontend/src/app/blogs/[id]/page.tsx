"use client"
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
}

interface BlogPost {
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
}

const blogPosts: Record<string, BlogPost> = {
  "1": {
    title: "The Future of AI in Education",
    content: "Artificial Intelligence is revolutionizing the way we approach education...",
    upvotes: 15,
    downvotes: 2,
    comments: [
      {
        id: 1,
        author: "John Doe",
        content: "Great article! I'm excited to see how AI will shape education.",
      },
      {
        id: 2,
        author: "Jane Smith",
        content: "I have some concerns about the ethical implications of AI in education.",
      },
    ],
  },
  // Add more blog posts here if needed
};

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const blogPost = id ? blogPosts[id] : null;
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    blogPost ? blogPost.comments : []
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        author: "Current User",
        content: newComment.trim(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-[#82CAFF] text-gray-800 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-xl">The requested blog post could not be found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#82CAFF] text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{blogPost.title}</h1>
          <p className="text-lg mb-6">{blogPost.content}</p>
          <div className="flex items-center space-x-4 text-white">
            <Button variant="outline" className="flex items-center">
              <ThumbsUp className="mr-2" size={18} />
              {blogPost.upvotes}
            </Button>
            <Button variant="outline" className="flex items-center">
              <ThumbsDown className="mr-2" size={18} />
              {blogPost.downvotes}
            </Button>
          </div>
        </article>

        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <ul className="space-y-4 mb-6">
            {comments.map((comment) => (
              <li key={comment.id} className="border-b pb-4">
                <p className="font-semibold">{comment.author}</p>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#82CAFF]"
            />
            <Button type="submit" className="bg-[#82CAFF] hover:bg-[#6AB6E6] text-white">
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