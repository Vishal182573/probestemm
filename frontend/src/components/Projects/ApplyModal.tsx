import { API_URL } from '@/constants';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Rocket } from 'lucide-react';
import { Textarea } from '../ui/textarea';

// Enums defining the types of projects and proposal categories
enum ProjectType {
    BUSINESS_PROJECT = "BUSINESS_PROJECT",
    PROFESSOR_PROJECT = "PROFESSOR_PROJECT",
    STUDENT_PROPOSAL = "STUDENT_PROPOSAL",
  }
  
  // Categories for different types of proposals/projects
  enum ProposalCategory {
    INTERNSHIP = "INTERNSHIP",
    PHD_POSITION = "PHD_POSITION",
    PROFESSOR_COLLABORATION = "PROFESSOR_COLLABORATION",
    STUDENT_OPPORTUNITY = "STUDENT_OPPORTUNITY",
    INDUSTRY_COLLABORATION = "INDUSTRY_COLLABORATION",
    RND_PROJECT = "RND_PROJECT",
    PROJECT="PROJECT"
  }
  
  // TypeScript interface defining the structure of a Project
  interface Project {
    id: string;
    topic: string;
    content: string;
    type: ProjectType;
    category: ProposalCategory;
    status: "OPEN" | "ONGOING" | "CLOSED";
    professorId:string;
    studentId:string;
    businessId:string;
    tags: string[];
    eligibility?: string;
    timeline?: string;
    deadline?: string;
    duration?: string;
    proposalFor?: string;
    isFunded?: boolean;
    fundDetails?: string;
    desirable?: string;
    techDescription?: string;
    requirements?: string;
    professor?: {
      id: string;
      fullName: string;
      email: string;
      department?: string;
    };
    business?: {
      id: string;
      companyName: string;
    };
    student?: {
      id: string;
      fullName: string;
      major?: string;
    };
    createdAt: string | Date;
  }
  
// Modal component for project applications
interface ApplicationFormData {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  resume: string | null;
}

interface ApplyModalProps {
    show: boolean;
    onClose: () => void;
    project: Project;
    onSuccess?: (projectId: string) => void;
  }
  
  export const ApplyModal: React.FC<ApplyModalProps> = ({ show, onClose, project, onSuccess }) => {
    // Form handling with react-hook-form
    const { register, handleSubmit, reset, setValue } = useForm({
      defaultValues: {
        name: localStorage.getItem("fullName") || "",
        email: localStorage.getItem("email") || "",
        phoneNumber: localStorage.getItem("phoneNumber") || "",
        description: "",
        resume: null
      }
    });
    
    // Submission state management
    const [submitting, setSubmitting] = React.useState(false);
  
    // Effect to update form values from localStorage
    useEffect(() => {
      setValue('name', localStorage.getItem("fullName") || localStorage.getItem("companyName") || "");
      setValue('email', localStorage.getItem("email") || "");
      setValue('phoneNumber', localStorage.getItem("phoneNumber") || "");
    }, [setValue, show]);
  
    // Form submission handler
    const onSubmit = async (data: ApplicationFormData) => {
      setSubmitting(true);
      try {
        // Create regular JSON payload instead of FormData
        const payload = {
          applicantId: localStorage.getItem("userId") || "",
          applicantType: localStorage.getItem("role") || "",
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber || "",
          description: data.description,
          resume: data.resume || "" // Send resume link as string
        };
        
        // Make POST request with JSON content type
        await axios.post(`${API_URL}/project/${project.id}/apply`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        
        // ...rest of the success handling code remains same
        const appliedProjectsStr = localStorage.getItem('appliedProjects') || '[]';
        const appliedProjects = JSON.parse(appliedProjectsStr);
        appliedProjects.push(project.id);
        localStorage.setItem('appliedProjects', JSON.stringify(appliedProjects));
  
        reset();
        onSuccess?.(project.id);
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Enhanced error handling
          const errorMessage = error.response?.data?.message || 'An unknown error occurred';
          alert(`Application failed: ${errorMessage}`);
          console.error("Application error:", error.response?.data);
        }
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <Modal show={show} onClose={onClose} title={`Apply`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                {...register("name")}
                className="w-full text-black bg-white"
                disabled
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                {...register("email")}
                className="w-full text-black bg-white"
                disabled
              />
            </div>
            {/* <div>
              <Input
                placeholder="Phone Number"
                {...register("phoneNumber")}
                className="w-full text-black bg-white"
                disabled
              />
            </div> */}
            <div>
              <Textarea
                placeholder="Application Description"
                {...register("description", { required: true })}
                className="w-full min-h-[150px]"
              />
            </div>
            {/* <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Select your resume
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF format only (max. 2 MB) (optional)
              </p>
              <Input
                type="file"
                accept=".pdf"
                {...register("resume")}
                className="w-full bg-white text-black"
              />
            </div> */}
            <div>
              <Input
                placeholder="resume drive link"
                {...register("resume")}
                className="w-full text-black bg-white focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#eb5e17] text-white hover:bg-[#472014]"
            >
              {submitting ? (
                <div className="flex items-center">
                  <Rocket className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    );
  };