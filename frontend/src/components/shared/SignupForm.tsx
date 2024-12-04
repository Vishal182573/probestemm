/* eslint-disable @typescript-eslint/no-unused-vars */ 
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User2Icon, PlusCircle, X, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { API_URL } from "@/constants";

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

const categories = {
    Physics: [
      "Classical Mechanics",
      "Electromagnetism",
      "Thermodynamics",
      "Quantum Mechanics",
      "Relativity",
    ],
    Chemistry: [
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Physical Chemistry",
      "Analytical Chemistry",
    ],
    Biology: [
      "Molecular Biology",
      "Cell Biology",
      "Ecology",
      "Evolutionary Biology",
    ],
    "Earth Sciences": ["Geology", "Meteorology", "Oceanography"],
    "Space Science": [
      "Astronomy",
      "Astrophysics",
      "Planetary Science",
      "Space Exploration",
      "Astrobiology",
      "Space Weather",
      "Space Policy and Law",
    ],
    "Computer Science": [
      "Algorithms and Data Structures",
      "Software Engineering",
      "Data Science",
      "Cybersecurity",
      "Human-Computer Interaction",
    ],
    Engineering: [
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
    ],
    "Pure Mathematics": [
      "Algebra",
      "Calculus",
      "Geometry",
      "Number Theory",
    ],
    "Applied Mathematics": [
      "Statistics",
      "Operations Research",
      "Mathematical Modeling",
      "Data Analysis",
      "Mathematical Economics",
    ],
    "Data Engineering": [
      "Data Pipeline Development",
      "Data Storage and Management",
    ],
    Robotics: [
      "Robot Design and Control",
      "Human-Robot Interaction",
      "Artificial Intelligence in Robotics",
    ],
    Biotechnology: [
      "Genetic Engineering",
      "Biochemical Engineering",
      "Biomedical Engineering",
      "Biomanufacturing",
    ],
    "Environmental Technology": [
      "Renewable Energy Technologies",
      "Environmental Monitoring and Management",
    ],
    "Space Technology": [
      "Satellite Technology",
      "Space Propulsion",
      "Space Systems and Instruments",
    ],
    "Pharmaceutical Engineering": [
      "Drug Formulation",
      "Process Engineering for Drug Production",
    ],
} as const;


type UserRole = "student" | "professor" | "business";

interface Education {
  degree: string;
  institution: string;
  passingYear: string;
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface Tag {
  category: string;
  subcategory: string;
}

interface Position {
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
}

interface Achievement {
  title: string;
  description: string;
  date: string;
}
interface ResearchInterest {
  title: string;
  description: string;
  image?: File;
  imagePreview?: string;
  imageUrl?: string;
}

interface RoleSpecificData extends UserData {
  title?: string;
  university?: string;
  department?: string;
  position?: string;
  degree?: string;
  website?: string;
  phoneNumber?: string;
  location?: string;
  positions?: Position[];
  achievements?: Achievement[];
  researchInterests?: ResearchInterest[];
  tags?: Tag[];
  education?: Education[];
  collegeName?: string;
  courseName?: string;
  experience?: string;
  companyName?: string;
  industry?: string;
  companyDescription?: string;
  companyWebsite?: string;
}

interface FileUploadResponse {
  url: string;
}

export const SignupForm: React.FC = () => {
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const [roleSpecificData, setRoleSpecificData] = useState<RoleSpecificData>({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    tags: [],
    researchInterests: [],
    education: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newResearchInterest, setNewResearchInterest] =
    useState<ResearchInterest>({
      title: "",
      description: "",
    });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...(roleSpecificData.education || [])];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    setRoleSpecificData({ ...roleSpecificData, education: newEducation });
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const response = await axios.post<{ imageUrl: string }>(
        `${API_URL}/image/upload`, 
        {"image":file}, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  };

  const addEducation = () => {
    setRoleSpecificData({
      ...roleSpecificData,
      education: [
        ...(roleSpecificData.education || []),
        { degree: "", institution: "", passingYear: "" },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...(roleSpecificData.education || [])];
    newEducation.splice(index, 1);
    setRoleSpecificData({ ...roleSpecificData, education: newEducation });
  };

  const handleRoleSpecificSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);
  
    try {
      let idCardUrl = '';
      if (idCardFile) {
        try {
          idCardUrl = await uploadFile(idCardFile);
          console.log(idCardUrl)
        } catch (error) {
          setUploadError('Failed to upload ID card');
          setIsUploading(false);
          return;
        }
      }
  
      const formData = new FormData();
  
      // Add basic fields
      Object.entries(roleSpecificData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          key !== 'tags' &&
          key !== 'researchInterests' &&
          key !== 'education'
        ) {
          formData.append(key, value.toString());
        }
      });
  
      // Add the ID card URL
      if (idCardUrl) {
        formData.append('idCard', idCardUrl);
      }
  
      // Rest of your existing formData append logic...
  
      const response = await authApi.post(
        `/${userData.role}/signup`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setIsSuccess(true);
      toast({
        title: 'Account created successfully!',
        description: 'Please wait for admin approval to access your account.',
        duration: 5000,
      });
  
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'An error occurred during signup');
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const MAX_TAGS = 3;

  const addTag = (category: string, subcategory: string) => {
    if (category && subcategory) {
      const currentTags = roleSpecificData.tags || [];
      
      // Check if we've reached the maximum tags limit
      if (currentTags.length >= MAX_TAGS) {
        toast({
          title: "Tag limit reached",
          description: `You can only select up to ${MAX_TAGS} tags.`,
          variant: "destructive",
        });
        return;
      }
      
      // Check if the tag already exists
      const tagExists = currentTags.some(
        tag => tag.category === category && tag.subcategory === subcategory
      );
      
      if (tagExists) {
        toast({
          title: "Tag already exists",
          description: "You have already selected this tag.",
          variant: "destructive",
        });
        return;
      }

      setRoleSpecificData({
        ...roleSpecificData,
        tags: [...currentTags, { category, subcategory }],
      });

      // Clear the selected category after adding a tag
      setSelectedCategory("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(roleSpecificData.tags || [])];
    newTags.splice(index, 1);
    setRoleSpecificData({ ...roleSpecificData, tags: newTags });
  };

  const addResearchInterest = () => {
    if (newResearchInterest.title && newResearchInterest.description) {
      setRoleSpecificData({
        ...roleSpecificData,
        researchInterests: [
          ...(roleSpecificData.researchInterests || []),
          newResearchInterest,
        ],
      });
      setNewResearchInterest({ title: "", description: "" });
    }
  };

  const removeResearchInterest = (index: number) => {
    const newInterests = [...(roleSpecificData.researchInterests || [])];
    newInterests.splice(index, 1);
    setRoleSpecificData({
      ...roleSpecificData,
      researchInterests: newInterests,
    });
  };
const [verified, setVerified] = useState(false);
const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);
const [emailError, setEmailError] = useState('');

const handleSendOtp = async () => {
  if (!userData.email) {
    setEmailVerification(prev => ({ ...prev, error: 'Email is required' }));
    return;
  }
  
  setEmailVerification(prev => ({ ...prev, loading: true, error: '' }));
  
  try {
    // First, check email existence
    const existenceResponse = await axios.post(`${API_URL}/auth/check-existence`, {
      email: userData.email
    });
    
    // If email already exists, show error
    if (existenceResponse.data.exists) {
      setEmailVerification(prev => ({
        ...prev,
        loading: false,
        error: `Email is already registered with ${existenceResponse.data.role} role`
      }));
      return;
    }
    
    // If email doesn't exist, proceed with OTP sending
    const response = await axios.post(`${API_URL}/email/send-email`, {
      email: userData.email
    });
    
    if (response.status === 200) {
      setEmailVerification(prev => ({
        ...prev,
        otpSent: true,
        loading: false
      }));
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    }
  } catch (error) {
    setEmailVerification(prev => ({
      ...prev,
      loading: false,
      error: 'Failed to send verification email. Please try again.'
    }));
  }
};

const handleVerifyOtp = async () => {
  if (!emailVerification.otp) {
    setEmailVerification(prev => ({
      ...prev,
      error: 'Please enter the verification code'
    }));
    return;
  }

  setEmailVerification(prev => ({ ...prev, loading: true, error: '' }));

  try {
    const response = await axios.post(`${API_URL}/email/validate-code`, {
      email: userData.email,
      code: emailVerification.otp
    });
    
    if (response.status === 200) {
      setEmailVerification(prev => ({
        ...prev,
        verified: true,
        loading: false
      }));
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified",
      });
    }
  } catch (error) {
    setEmailVerification(prev => ({
      ...prev,
      loading: false,
      error: 'Invalid verification code. Please try again.'
    }));
  }
};

const handleInitialSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!emailVerification.verified) {
    toast({
      title: "Email verification required",
      description: "Please verify your email before proceeding",
      variant: "destructive"
    });
    return;
  }

  setRoleSpecificData({
    ...roleSpecificData,
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    role: userData.role,
  });
  setStep(2);
};

const [emailVerification, setEmailVerification] = useState({
  otpSent: false,
  otp: '',
  verified: false,
  loading: false,
  error: ''
});

const renderInitialForm = () => (
  <form className="space-y-4 text-black bg-white" onSubmit={handleInitialSubmit}>
    <Input
      type="text"
      placeholder="Full Name"
      value={userData.fullName}
      onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
      required
      className="text-black bg-white"
    />
    
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Email Address"
          value={userData.email}
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
            setEmailVerification(prev => ({ ...prev, verified: false, otpSent: false }));
          }}
          required
          disabled={emailVerification.verified}
          className="text-black bg-white"
        />
        {!emailVerification.verified && (
          <Button 
            type="button" 
            onClick={handleSendOtp}
            disabled={emailVerification.loading || !userData.email}
            className="whitespace-nowrap"
          >
            {emailVerification.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : emailVerification.otpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
        )}
      </div>

      {emailVerification.otpSent && !emailVerification.verified && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Verification Code"
            value={emailVerification.otp}
            onChange={(e) => setEmailVerification(prev => ({ ...prev, otp: e.target.value }))}
            required
            className="text-black bg-white"
          />
          <Button 
            type="button" 
            onClick={handleVerifyOtp}
            disabled={emailVerification.loading || !emailVerification.otp}
            className="whitespace-nowrap"
          >
            {emailVerification.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : 'Verify'}
          </Button>
        </div>
      )}

      {emailVerification.error && (
        <p className="text-sm text-red-500">{emailVerification.error}</p>
      )}

      {emailVerification.verified && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Email verified successfully
        </div>
      )}
    </div>

    <div className="relative">
        <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
            className="text-black bg-white"
          />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center text-gray-600 text-sm "
      >
        {showPassword ? "Hide" : "Show"} 
      </button>
    </div>

    <Select
      onValueChange={(value) => setUserData({ ...userData, role: value as UserRole })}
    >
      <SelectTrigger>
        <SelectValue placeholder="I am a..." />
      </SelectTrigger>
      <SelectContent className="text-black bg-white">
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="professor">Professor/Researcher</SelectItem>
        <SelectItem value="business">Industry</SelectItem>
      </SelectContent>
    </Select>

    <div className="flex items-center space-x-2">
      <Checkbox id="terms" required />
      <label htmlFor="terms" className="text-sm text-muted-foreground">
        I agree to the <a href="/terms-condition">Terms of Service</a> and <a href="/privacy-policy">Privacy Policy</a>
      </label>
    </div>

    <Button 
      type="submit" 
      className="w-full"
      disabled={!emailVerification.verified}
    >
      Next
      <User2Icon className="ml-2 h-4 w-4" />
    </Button>
  </form>
);


  const renderProfessorForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title">Designation  <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          type="text"
          value={roleSpecificData.title || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              title: e.target.value,
            })
          }
          required
          placeholder="Enter your academic designation"
          className="text-black bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
        <Input
          id="department"
          type="text"
          value={roleSpecificData.department || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              department: e.target.value,
            })
          }
          required
          placeholder="Enter your department name"
          className="text-black bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University/Institute <span className="text-red-500">*</span></Label>
        <Input
          id="university"
          type="text"
          value={roleSpecificData.university || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              university: e.target.value,
            })
          }
          required
          placeholder="Enter your university or institute name"
          className="text-black bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Country <span className="text-red-500">*</span></Label>
        <Input
          id="location"
          type="text"
          value={roleSpecificData.location || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              location: e.target.value,
            })
          }
          required
          placeholder="Enter your country"
          className="text-black bg-white"
        />
      </div>


      <div className="space-y-2">
        <Label>Tags (Optional: Select up to {MAX_TAGS}) <span className="text-red-500">*</span></Label>
        <div className="flex space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="text-black bg-white">
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value=""
            onValueChange={(subcategory) => addTag(selectedCategory, subcategory)}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent className="text-black bg-white">
              {selectedCategory &&
                categories[selectedCategory as keyof typeof categories].map(
                  (subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  )
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {roleSpecificData.tags?.map((tag, index) => (
            <div
              key={index}
              className="bg-primary/10 px-2 py-1 rounded-md flex items-center gap-2"
            >
              <span className="text-sm">
                {tag.category} - {tag.subcategory}
              </span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-red-500 hover:bg-red-100 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {roleSpecificData.tags && roleSpecificData.tags.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {roleSpecificData.tags.length} of {MAX_TAGS} tags selected
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website <span className="text-red-500">*</span></Label>
        <Input
          id="website"
          type="url"
          value={roleSpecificData.website || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              website: e.target.value,
            })
          }
          required={true}
          placeholder="Enter your professional website URL"
          className="text-black bg-white"
        />
      </div>

      <div className="space-y-2">
      <Label htmlFor="idCard">ID Card Upload <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-2">
        <Input
          id="idCard"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setIdCardFile(file);
              setUploadError(null);
            }
          }}
          required
           placeholder="Upload your ID card"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 bg-white text-black"
        />
        {idCardFile && (
          <span className="text-sm text-muted-foreground">
            {idCardFile.name}
          </span>
        )}
      </div>
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
    </div>

    <Button 
      type="submit" 
      className="w-full"
      disabled={isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        'Complete Signup'
      )}
    </Button>
  </form>
  );

  const renderStudentForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      {/* <div className="space-y-2">
        <Label>Education</Label>
        {roleSpecificData.education?.map((edu, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
              required
            />
            <Input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
              required
            />
            <select
  value={edu.passingYear}
  onChange={(e) => updateEducation(index, "passingYear", e.target.value)}
  required
  className="bg-secondary text-white text-center px-1 rounded-lg "
>
  <option value="" disabled>Select Year</option>
  {Array.from({ length: 50 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  })}
</select>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeEducation(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addEducation}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="collegeName">College/Institue Name <span className="text-red-500">*</span></Label>
        <Input
          id="collegeName"
          type="text"
          value={roleSpecificData.collegeName || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              collegeName: e.target.value,
            })
          }
          required
          placeholder="Enter you College/Institute name"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name <span className="text-red-500">*</span></Label>
        <Input
          id="courseName"
          type="text"
          value={roleSpecificData.courseName || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              courseName: e.target.value,
            })
          }
          required
          placeholder="Enter your course name"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Country <span className="text-red-500">*</span></Label>
        <Input
          id="location"
          type="text"
          value={roleSpecificData.location || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              location: e.target.value,
            })
          }
          required
          placeholder="Enter your country name"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
      <Label htmlFor="idCard">ID Card Upload <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-2">
        <Input
          id="idCard"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setIdCardFile(file);
              setUploadError(null);
            }
          }}
          required
          placeholder="Upload you Id card"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/ bg-white text-black"
        />
        {idCardFile && (
          <span className="text-sm text-muted-foreground">
            {idCardFile.name}
          </span>
        )}
      </div>
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
    </div>

    <Button 
      type="submit" 
      className="w-full"
      disabled={isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        'Complete Signup'
      )}
    </Button>
  </form>
  );

  const renderBusinessForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
        <Input
          id="companyName"
          type="text"
          value={roleSpecificData.companyName || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              companyName: e.target.value,
            })
          }
          required
          placeholder="Enter you company name"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
        <Input
          id="industry"
          type="text"
          value={roleSpecificData.industry || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              industry: e.target.value,
            })
          }
          required
          placeholder="Enter your Industry type Ex:- Pvt.Ltd"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyDescription">Company Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="companyDescription"
          value={roleSpecificData.companyDescription || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              companyDescription: e.target.value,
            })
          }
          required
          placeholder="Enter description of your company"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Country <span className="text-red-500">*</span></Label>
        <Input
          id="location"
          type="text"
          value={roleSpecificData.location || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              location: e.target.value,
            })
          }
          required
          placeholder="Enter country. where your company situated"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyWebsite">Company Website <span className="text-red-500">*</span></Label>
        <Input
          id="companyWebsite"
          type="url"
          value={roleSpecificData.companyWebsite || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              companyWebsite: e.target.value,
            })
          }
          required
          placeholder="Enter company website URL"
          className="text-black bg-white"
        />
      </div>
      <div className="space-y-2">
      <Label htmlFor="idCard">ID Card Upload <span className="text-red-500">*</span></Label>
      <div className="flex items-center gap-2">
        <Input
          id="idCard"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setIdCardFile(file);
              setUploadError(null);
            }
          }}
          required
          placeholder="Upload company related card"
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 bg-white text-black"
        />
        {idCardFile && (
          <span className="text-sm text-muted-foreground">
            {idCardFile.name}
          </span>
        )}
      </div>
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}
    </div>

    <Button 
      type="submit" 
      className="w-full"
      disabled={isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        'Complete Signup'
      )}
    </Button>
  </form>
  );

  const renderRoleSpecificForm = () => {
    switch (userData.role) {
      case "professor":
        return renderProfessorForm();
      case "student":
        return renderStudentForm();
      case "business":
        return renderBusinessForm();
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <User2Icon className="w-6 h-6 inline-block mr-2" />
          {step === 1
            ? "Create Your Account"
            : `Complete Your ${userData.role} Profile`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isSuccess ? (
          <Alert className="mb-4">
            <AlertDescription>
              Account created successfully! Redirecting to login page...
            </AlertDescription>
          </Alert>
        ) : step === 1 ? (
          renderInitialForm()
        ) : (
          renderRoleSpecificForm()
        )}
        {step === 2 && (
          <Button
            variant="outline"
            className="mt-4 w-full text-white "
            onClick={() => setStep(1)}
          >
            Back to Basic Info
          </Button>
        )}
        {step === 1 && (
          <Link
            href="/login"
            className="text-primary text-sm text-center block mt-4 hover:underline"
          >
            Already have an account? Log In
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default SignupForm;
