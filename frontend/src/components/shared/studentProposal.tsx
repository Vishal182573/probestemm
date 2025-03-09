import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, CheckCircle } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/constants";
import { toast } from "react-hot-toast";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";

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

// Define TypeScript interface for component props
interface StudentProposalFormProps {
  studentId: string;
  onProposalSubmitted: (newProject: Array<Project>) => void;
}

// Define TypeScript interface for form data structure
interface FormDataType {
  topic: string;
  techDescription: string;
  content: string;
  proposalFor: string;
  tags: string[];
  isFunded: boolean;
  deadline: Date | null;
}

// Main component definition with TypeScript typing
const StudentProposalForm: React.FC<StudentProposalFormProps> = ({
  studentId,
  onProposalSubmitted,
}) => {
  // State management using React hooks
  // formData: stores the form input values
  const [formData, setFormData] = useState<FormDataType>({
    topic: "",
    content: "",
    techDescription: "",
    proposalFor: "",
    tags: [],
    isFunded: false,
    deadline: null,
  });
  // isSubmitting: tracks form submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // isSubmitted: tracks if form has been successfully submitted
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Make API call to submit the proposal
      const response = await axios.post(
        `${API_URL}/project/student-proposal`,
        {
          studentId,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Call the callback with the new project data
      onProposalSubmitted(response.data);

      // Reset form and show success message
      setFormData({ topic: "", content: "", techDescription: "" , proposalFor: "", tags: [], isFunded: false, deadline: null });
      setIsSubmitted(true);
      toast.success("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes for all form fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "tags") {
      // Allow typing commas and spaces by not immediately converting to array
      setFormData((prev) => ({
        ...prev,
        tags: value.includes(",") 
          ? value.split(",").map(tag => tag.trim()).filter(tag => tag !== "") 
          : [value.trim()]
      }));
    }
    else if (name === "deadline") {
      setFormData((prev) => ({
        ...prev,
        deadline: new Date(value)
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Reset the form to allow submitting another proposal
  const handleReset = () => {
    setIsSubmitted(false);
  };

  // Conditional rendering for success state
  if (isSubmitted) {
    return (
      // Success card showing submission confirmation
      <Card className="border-2 border-green-500/20 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-extrabold text-green-600 font-caveat">
            <CheckCircle className="mr-2 h-8 w-8 text-green-600" />
            Proposal Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-700">
            Your project proposal has been successfully submitted!
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleReset} 
              className="bg-[#eb5e17] hover:bg-[#472014] text-white"
            >
              Submit Another Proposal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main form render
  return (
    // Card container for the proposal form
    <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
          <Send className="mr-2 h-6 w-6" />
          Submit Project Proposal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form with three main input fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown for selecting proposal type */}
          <div>
            <label
              htmlFor="content"
              className="block text-[#472014] font-semibold mb-2"
            >
              What are you looking for?
            </label>
            <select
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
            >
              <option value="" disabled>
                Select your option
              </option>
              <option value="Internship">Internship</option>
              <option value="Project">Project</option>
              <option value="PhD Position">PhD Position</option>
            </select>
          </div>

          {/* Dropdown for selecting 'proposal for' */}
          <div>
            <label
              htmlFor="proposalFor"
              className="block text-[#472014] font-semibold mb-2"
            >
              Proposal for
            </label>
            <select
              id="proposalFor"
              name="proposalFor"
              value={formData.proposalFor}
              onChange={handleChange}
              required
              className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
            >
              <option value="" disabled>
                Select your option
              </option>
              <option value="Professor">Professor</option>
              <option value="Industry">Industry</option>
            </select> 
          </div>

          {/* Input field for proposal topic */}
          <div>
            <label
              htmlFor="topic"
              className="block text-[#472014] font-semibold mb-2"
            >
              Topic
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
            />
          </div>

          {/* add tags here comma separated */}
          <div>
            <Label
              htmlFor="tags"
              className="block text-[#472014] font-semibold mb-2"
            >
              Tags (comma separated)
            </Label>
            <input
              type="text"
              id="tags"
              name="tags"
              // value={formData.tags.join(",")}  // Remove the extra space after comma
              onChange={handleChange}
              required
              placeholder="Enter tags separated by commas"
              className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
            />
          </div>

          {/* Textarea for technical description */}
          <div>
            <label
              htmlFor="techDescription"
              className="block text-[#472014] font-semibold mb-2"
            >
              Technical Description
            </label>
            <textarea
              id="techDescription"
              name="techDescription"
              value={formData.techDescription}
              onChange={handleChange}
              required
              className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="deadline" 
            className="block text-[#472014] font-semibold mb-2">Application Deadline 
              <br />
              (Project will be deleted 10 days after the deadline)</label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
                onChange={handleChange}
                required
                className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent"
              />
        </div>

          {/* Dropdown for selecting funding status */}
          <div>
            <Label className="block text-[#472014] font-semibold mb-2">Funding Condition</Label>
            <Select 
              name="isFunded" 
              value={formData.isFunded.toString()} 
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  isFunded: value === "true"
                }))
              }}
            >
              <SelectTrigger className="w-full p-2 text-black bg-white border-2 border-[#eb5e17]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#eb5e17] focus:border-transparent">
                <SelectValue placeholder="Select funding status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="true">Mandatory</SelectItem>
                <SelectItem value="false">Not Mandatory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit button with loading state */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#eb5e17] hover:bg-[#472014] text-white transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Proposal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentProposalForm;