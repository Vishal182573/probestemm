/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/constants";

interface ApplicationDetails {
  id: string;
  description: string;
  resume: string;
  applicationType: "professor" | "student" | "business";
  applicantDetails: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string; 
    institution?: string;
    department?: string;
  };
  createdAt: string;
}
interface Project {
  id: string;
  topic: string;
  content: string;
  difficulty: "EASY" | "INTERMEDIATE" | "HARD";
  timeline: string;
  status: "OPEN" | "ONGOING" | "CLOSED";
  type: "RD_PROJECT" | "INTERNSHIP";
  category: string;
  business?: { id: string; companyName: string };
  professor?: { id: string; fullName: string };
  applications?: ApplicationDetails[];
  selectedApplicant: {
    id:string;
    type: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    images: string[]
  }
  createdAt: string | Date;
}

// Define the possible collaboration types
type CollaborationType = "students" | "professors" | "";
interface CreateProjectFormProps {
  businessId: string;
  onProjectCreated?: (project: Array<Project>) => void;
}

// Main component that handles project creation
// Takes businessId as a prop to associate the project with a business
const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ 
  businessId, 
  onProjectCreated 
}) => {
  // State management for form
  const [collaborationType, setCollaborationType] = useState<CollaborationType>("");
  const [isCreatingProject, setIsCreatingProject] = useState(false); // Controls loading state
  const [isSuccess, setIsSuccess] = useState(false); // Controls success message display
  const [error, setError] = useState(""); // Stores error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingProject(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const isFunded = formData.get("isFunded");

    const projectData = {
      businessId,
      techDescription: formData.get("techDescription"),
      topic: formData.get("topic"),
      eligibility: formData.get("eligibility"),
      deadline: formData.get("deadline"),
      duration: formData.get("duration"),
      isFunded: isFunded === "true" ? true : false,
      desirable: formData.get("desirable"),
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim()),
    };

    try {
      const endpoint = collaborationType === "students"
        ? `${API_URL}/project/internship`
        : `${API_URL}/project/rd-project`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(projectData),
      });

      const newProject = await response.json();

      // Format the project data to match the expected structure
      const formattedProject = {
        ...newProject,
        id: newProject.id,
        topic: newProject.topic,
        content: newProject.techDescription,
        difficulty: "INTERMEDIATE",
        timeline: newProject.duration,
        status: "OPEN",
        type: collaborationType === "students" ? "INTERNSHIP" : "RD_PROJECT",
        category: collaborationType === "students" ? "INTERNSHIP" : "RND_PROJECT",
        business: {
          id: businessId,
          companyName: localStorage.getItem("companyName") || "",
        },
        createdAt: new Date().toISOString(),
        applications: [],
      };

      if (onProjectCreated) {
        onProjectCreated(formattedProject);
      }

      setIsSuccess(true);
      e.currentTarget.reset();
      setCollaborationType("");
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Render success message if project creation was successful
  if (isSuccess) {
    return (
      <Card className="bg-white text-black border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Project Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your project has been submitted & It is live on Project Openings page.
              </p>
            </div>
            <Button
              onClick={() => setIsSuccess(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Another Project
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main form render
  return (
    <Card className="bg-white text-black border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Create Project</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display error message if there is one */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Project creation form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Collaboration Type Selection */}
          <div className="space-y-2">
            <Label>Collaboration Type</Label>
            <Select
              name="collaborationType"
              value={collaborationType}
              onValueChange={(value: CollaborationType) =>
                setCollaborationType(value)
              }
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Collaboration Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="professors">Professors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional form fields - only shown after collaboration type is selected */}
          {collaborationType && (
            <>
              {/* Project Description Field */}
              <div className="space-y-2">
                <Label>Technical Description</Label>
                <Textarea
                  name="techDescription"
                  placeholder="Enter project description"
                  required
                  className="bg-white"
                />
              </div>

              {/* Project Topic Field */}
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  name="topic"
                  placeholder="Enter project topic"
                  required
                  className="bg-white"
                />
              </div>

              {/* Tags Input Field */}
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  name="tags"
                  placeholder="e.g., AI, Machine Learning, Data Science"
                  className="bg-white"
                />
              </div>

              {/* Eligibility Criteria Field */}
              <div className="space-y-2">
                <Label>Eligibility Criteria</Label>
                <Input
                  name="eligibility"
                  placeholder="Enter eligibility requirements"
                  required
                  className="bg-white"
                />
              </div>

              {/* deadline field */}
              <div className="space-y-2">
                <Label>Application Deadline
                  <br /> (Project will be deleted 10 days after the deadline)
                </Label>
                <Input
                  type="date"
                  name="deadline"
                  required
                  className="bg-white"
                />
              </div>

              {/* Duration Fields */}
              <div className="space-y-2">
                <Label>Project Duration</Label>
                <Input
                  name="duration"
                  placeholder="Enter project duration"
                  required
                  className="bg-white"
                />
              </div>

              {/* Funding Status Selection */}
              <div>
                <Label>Is Funded</Label>
                <Select name="isFunded" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desirable Skills Field */}
              <div className="space-y-2">
                <Label>Desirable Skills</Label>
                <Input
                  name="desirable"
                  placeholder="Enter desirable skills"
                  className="bg-white"
                />
              </div>
            </>
          )}

          {/* Submit Button with Loading State */}
          <Button
            type="submit"
            disabled={isCreatingProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreatingProject ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProjectForm;
