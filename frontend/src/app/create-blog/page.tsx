"use client"
import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content });
    router.push("/blogs");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#82CAFF] text-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="shadow-lg mx-auto max-w-3xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-4xl font-bold text-gray-900">
              <FileText className="w-8 h-8" />
              <span>Create New Blog Post</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="flex items-center space-x-2 text-lg font-medium text-gray-800"
                >
                  <Pencil className="w-5 h-5" />
                  <span>Title</span>
                </label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-100 text-gray-800 border-gray-300"
                  placeholder="Enter your blog title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="flex items-center space-x-2 text-lg font-medium text-gray-800"
                >
                  <FileText className="w-5 h-5" />
                  <span>Content</span>
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-100 text-gray-800 border-gray-300"
                  rows={8}
                  placeholder="Write your blog content here..."
                  required
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Publish Blog Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CreateBlogPost;