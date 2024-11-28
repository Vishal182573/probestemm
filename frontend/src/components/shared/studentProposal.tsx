import React, { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, CheckCircle } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/constants";
import { toast } from "react-hot-toast";

interface StudentProposalFormProps {
  studentId: string;
}

interface FormDataType {
  topic: string;
  techDescription: string;
  content: string;
}

const StudentProposalForm: React.FC<StudentProposalFormProps> = ({
  studentId,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    topic: "",
    content: "",
    techDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(
        `${API_URL}/project/student-proposal`,
        {
          studentId,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Reset form and show submitted state
      setFormData({ topic: "", content: "", techDescription: "" });
      setIsSubmitted(true);
      toast.success("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
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

  return (
    <Card className="border-2 border-[#eb5e17]/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-extrabold text-[#eb5e17] font-caveat">
          <Send className="mr-2 h-6 w-6" />
          Submit Project Proposal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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