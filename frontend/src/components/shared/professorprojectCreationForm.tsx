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

type CollaborationType = "students" | "professors" | "";

const CreateProjectForm = ({ businessId }: { businessId: string }) => {
  const [collaborationType, setCollaborationType] =
    useState<CollaborationType>("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingProject(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fundValue = formData.get("fundDetails");

    const data = {
      businessId,
      content: formData.get("content"),
      topic: formData.get("topic"),
      eligibility: formData.get("eligibility"),
      duration: {
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
      },
      fundDetails: fundValue ? String(fundValue) : "",
      desirable: formData.get("desirable"),
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim()),
    };

    try {
      const endpoint =
        collaborationType === "students"
          ? `${API_URL}/project/internship`
          : `${API_URL}/project/rd-project`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      //   if (!response.ok) throw new Error('Failed to create project');

      setIsSuccess(true);
      // Reset form
      e.currentTarget.reset();
      setCollaborationType("");
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsCreatingProject(false);
    }
  };

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
                Your project has been submitted and is now ready for review.
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

  return (
    <Card className="bg-white text-black border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Create Project</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {collaborationType && (
            <>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="content"
                  placeholder="Enter project description"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  name="topic"
                  placeholder="Enter project topic"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  name="tags"
                  placeholder="e.g., AI, Machine Learning, Data Science"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Eligibility Criteria</Label>
                <Input
                  name="eligibility"
                  placeholder="Enter eligibility requirements"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Fund Amount</Label>
                <Input
                  type="number"
                  name="fundDetails"
                  placeholder="Enter fund amount"
                  className="bg-white"
                />
              </div>

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
