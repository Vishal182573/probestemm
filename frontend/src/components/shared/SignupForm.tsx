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
import { Label } from "@/components/ui/label";
import { User2Icon, PlusCircle, X, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { API_URL } from "@/constants";
import { Modal } from "./Modal";

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

type UserRole = "student" | "professor" | "business";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface RoleSpecificData {
  phoneNumber: string;
  location: string;
  profileImage: File | null;
  university?: string;
  course?: string;
  researchHighlights?: ResearchHighlight[];
  experience?: string;
  education?: Education[];
  achievements?: Achievement[];
  title?: string;
  website?: string;
  degree?: string;
  department?: string;
  position?: string;
  researchInterests?: string;
  positions?: Position[];
  companyName?: string;
  industry?: string;
  description?: string;
}

interface Education {
  degree: string;
  institution: string;
  passingYear: string;
}

interface ResearchHighlight {
  title: string;
  status: "ONGOING" | "COMPLETED";
}

interface Position {
  title: string;
  institution: string;
  startYear: string;
  endYear?: string;
  current: boolean;
}

interface Achievement {
  year: string;
  description: string;
}

const inputStyles = "bg-white/90 border-[#472014] focus:border-[#c1502e] focus:ring-[#c1502e] text-black";
const buttonStyles = "bg-[#c1502e] hover:bg-[#472014] text-white font-bold transition-all duration-300";
const labelStyles = "text-[#472014] font-semibold";

export const SignupForm: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [roleSpecificData, setRoleSpecificData] = useState<RoleSpecificData>({
    phoneNumber: "",
    location: "",
    profileImage: null,
    education: [],
    researchHighlights: [],
    achievements: [],
    positions: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep(2);
  };

  const handleRoleSpecificSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      Object.entries(roleSpecificData).forEach(([key, value]) => {
        if (key === "profileImage" && value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await authApi.post(
        `/${userData.role}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if(response.data) setIsSuccess(true);
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your new account.",
        duration: 5000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.error || "An error occurred during signup"
        );
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRoleSpecificData({
        ...roleSpecificData,
        profileImage: e.target.files[0],
      });
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

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...(roleSpecificData.education || [])];
    newEducation[index][field] = value;
    setRoleSpecificData({ ...roleSpecificData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...(roleSpecificData.education || [])];
    newEducation.splice(index, 1);
    setRoleSpecificData({ ...roleSpecificData, education: newEducation });
  };

  const renderInitialForm = () => (
    <>
    <form className="space-y-4" onSubmit={handleInitialSubmit}>
      <div className="space-y-2">
        <Label htmlFor="fullName" className={labelStyles}>Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={userData.fullName}
          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          className={inputStyles}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={labelStyles}>Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          className={inputStyles}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className={labelStyles}>Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          className={inputStyles}
          required
        />
      </div>

      <div className="space-y-2">
        <Label className={labelStyles}>I am a...</Label>
        <Select
          onValueChange={(value) =>
            setUserData({ ...userData, role: value as UserRole })
          }
          required
        >
          <SelectTrigger className={inputStyles}>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="professor">Professor/Teacher</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="terms" required className="border-[#472014]"/>
        <Label htmlFor="terms" className="text-sm text-[#472014]">
          I agree to the <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-sm text-blue-500"
                >Privacy Policy
                </button> and <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-sm text-blue-500"
                >Terms of Service
                </button>
        </Label>
      </div>

      <Link
        href="/login"
        className="text-[#c1502e] hover:text-[#472014] text-sm text-center block mt-2 mb-4 font-semibold transition-colors duration-300"
      >
        Already have an account? Log In
      </Link>

      <Button type="submit" className={`w-full ${buttonStyles}`}>
        Next Step
        <Rocket className="ml-2 h-4 w-4" />
      </Button>
    </form>
    <Modal
    isOpen={isPrivacyOpen}
    onClose={() => setIsPrivacyOpen(false)}
    title="Privacy Policy"
  >
    <div className="prose text-black">lorem700
    </div>
  </Modal>

  <Modal
    isOpen={isTermsOpen}
    onClose={() => setIsTermsOpen(false)}
    title="Terms of Service"
  >
    <div className="prose text-black"> ex
    </div>
  </Modal>
  </>
  );

  const renderEducationForm = () => (
    <div className="space-y-2">
      <Label className={labelStyles}>Education</Label>
      {roleSpecificData.education?.map((edu, index) => (
        <div key={index} className="flex flex-wrap gap-2 p-4 bg-white/50 rounded-lg">
          <Input
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => updateEducation(index, "degree", e.target.value)}
            className={inputStyles}
          />
          <Input
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => updateEducation(index, "institution", e.target.value)}
            className={inputStyles}
          />
          <Input
            placeholder="Passing Year"
            value={edu.passingYear}
            onChange={(e) => updateEducation(index, "passingYear", e.target.value)}
            className={inputStyles}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeEducation(index)}
            className="border-[#472014] text-[#472014] hover:bg-[#472014] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button 
        type="button" 
        variant="outline" 
        onClick={addEducation}
        className="border-[#c1502e] text-[#c1502e] hover:bg-[#c1502e] hover:text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );

  const renderRoleSpecificForm = () => {
    const commonFields = (
      <>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className={labelStyles}>Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={roleSpecificData.phoneNumber}
            onChange={(e) =>
              setRoleSpecificData({
                ...roleSpecificData,
                phoneNumber: e.target.value,
              })
            }
            className={inputStyles}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className={labelStyles}>Location</Label>
          <Input
            id="location"
            type="text"
            value={roleSpecificData.location}
            onChange={(e) =>
              setRoleSpecificData({
                ...roleSpecificData,
                location: e.target.value,
              })
            }
            className={inputStyles}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage" className={labelStyles}>Profile Image</Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={inputStyles}
          />
        </div>
      </>
    );

    switch (userData.role) {
      case "student":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
            {renderEducationForm()}
            <div className="space-y-2">
              <Label htmlFor="university" className={labelStyles}>University/College Name</Label>
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
                className={inputStyles}
                required
              />
            </div>

            <Button type="submit" className={`w-full ${buttonStyles}`}>
              Complete Signup
            </Button>
          </form>
        );

      case "professor":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="title" className={labelStyles}>Academic Title</Label>
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
                className={inputStyles}
                required
              />
            </div>

            <Button type="submit" className={`w-full ${buttonStyles}`}>
              Complete Signup
            </Button>
          </form>
        );

      case "business":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="companyName" className={labelStyles}>Company Name</Label>
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
                className={inputStyles}
                required
              />
            </div>

            <Button type="submit" className={`w-full ${buttonStyles}`}>
              Complete Signup
            </Button>
          </form>
        );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-[#c1502e] to-[#686256] text-white rounded-t-lg">
        <CardTitle className="text-2xl font-caveat font-bold text-center">
          <User2Icon className="w-6 h-6 inline-block mr-2" />
          {step === 1 ? "Create Your Account" : `${userData.role} Profile`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isSuccess ? (
          <Alert className="mb-4 bg-[#472014] text-white">
            <AlertDescription>
              Account created successfully! Redirecting to login page...
            </AlertDescription>
          </Alert>
        ) : step === 1 ? (
          renderInitialForm()
        ) : (
          renderRoleSpecificForm()
        )}
        {error && (
          <p className="text-red-500 mt-4 font-semibold">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};