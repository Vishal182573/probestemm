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
import { User2Icon, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

const categories = {
  Science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Earth Sciences",
    "Space Science",
  ],
  Technology: ["Computer Science", "Engineering"],
  Engineering: [
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
  ],
  Mathematics: ["Pure Mathematics", "Applied Mathematics"],
  "Engineering Technology": [
    "Data Engineering",
    "Robotics",
    "Biotechnology",
    "Environmental Technology",
    "Space Technology",
    "Pharmaceutical Engineering",
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

export const SignupForm: React.FC = () => {
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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRoleSpecificData({
      ...roleSpecificData,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });
    setStep(2);
  };

  const handleRoleSpecificSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();

      // Add basic fields
      Object.entries(roleSpecificData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          key !== "tags" &&
          key !== "researchInterests" &&
          key !== "education"
        ) {
          formData.append(key, value.toString());
        }
      });

      // Handle tags
      if (roleSpecificData.tags) {
        formData.append("tags", JSON.stringify(roleSpecificData.tags));
      }

      // Handle education
      if (roleSpecificData.education) {
        formData.append(
          "education",
          JSON.stringify(roleSpecificData.education)
        );
      }

      // Handle research interests and their images
      if (roleSpecificData.researchInterests) {
        const interestsWithoutImages = roleSpecificData.researchInterests.map(
          (interest, index) => ({
            title: interest.title,
            description: interest.description,
            imageIndex: interest.image ? index : undefined, // Add index reference for images
          })
        );

        formData.append(
          "researchInterests",
          JSON.stringify(interestsWithoutImages)
        );

        // Append images with index in filename
        roleSpecificData.researchInterests.forEach((interest, index) => {
          if (interest.image) {
            formData.append(`researchInterestImage_${index}`, interest.image);
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await authApi.post(
        `/${userData.role}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSuccess(true);
      toast({
        title: "Account created successfully!",
        description: "Please wait for admin approval to access your account.",
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

  const addTag = (category: string, subcategory: string) => {
    if (category && subcategory) {
      setRoleSpecificData({
        ...roleSpecificData,
        tags: [...(roleSpecificData.tags || []), { category, subcategory }],
      });
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

  const renderInitialForm = () => (
    <form className="space-y-4" onSubmit={handleInitialSubmit}>
      <Input
        type="text"
        placeholder="Full Name"
        value={userData.fullName}
        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Email Address"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        required
      />
      <Select
        onValueChange={(value) =>
          setUserData({ ...userData, role: value as UserRole })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="I am a..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="professor">Professor/Teacher</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>
      <Button type="submit" className="w-full">
        Next
        <User2Icon className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );

  const renderProfessorForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          type="text"
          value={roleSpecificData.position || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              position: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          type="text"
          value={roleSpecificData.degree || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              degree: e.target.value,
            })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Research Interests</Label>
        <div className="flex flex-col space-y-2">
          <Input
            placeholder="Interest Title"
            value={newResearchInterest.title}
            onChange={(e) =>
              setNewResearchInterest({
                ...newResearchInterest,
                title: e.target.value,
              })
            }
          />
          <Textarea
            placeholder="Description"
            value={newResearchInterest.description}
            onChange={(e) =>
              setNewResearchInterest({
                ...newResearchInterest,
                description: e.target.value,
              })
            }
          />
          <div className="flex flex-col space-y-2">
            <Label>Upload Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Create preview URL
                  const previewUrl = URL.createObjectURL(file);
                  setNewResearchInterest({
                    ...newResearchInterest,
                    image: file,
                    imagePreview: previewUrl,
                  });
                }
              }}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {newResearchInterest.imagePreview && (
              <div className="relative w-40 h-40 mt-2">
                <Image
                  src={newResearchInterest.imagePreview}
                  width={160}
                  height={160}
                  alt="Preview"
                  className="rounded-md object-cover w-full h-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    if (newResearchInterest.imagePreview) {
                      URL.revokeObjectURL(newResearchInterest.imagePreview);
                    }
                    setNewResearchInterest({
                      ...newResearchInterest,
                      image: undefined,
                      imagePreview: undefined,
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <Button type="button" onClick={addResearchInterest}>
            Add Research Interest
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleSpecificData.researchInterests?.map((interest, index) => (
            <div
              key={index}
              className="bg-primary/10 p-4 rounded-md flex flex-col space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{interest.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {interest.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeResearchInterest(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {interest.imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={interest.imageUrl}
                    alt={interest.title}
                    width={192}
                    height={96}
                    className="rounded-md object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(subcategory) =>
              addTag(selectedCategory, subcategory)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
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
              {tag.category} - {tag.subcategory}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
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
        />
      </div>

      <Button type="submit" className="w-full">
        Complete Signup
      </Button>
    </form>
  );

  const renderStudentForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      <div className="space-y-2">
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
            <Input
              placeholder="Passing Year"
              value={edu.passingYear}
              onChange={(e) =>
                updateEducation(index, "passingYear", e.target.value)
              }
              required
            />
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="collegeName">College Name</Label>
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name</Label>
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          value={roleSpecificData.experience || ""}
          onChange={(e) =>
            setRoleSpecificData({
              ...roleSpecificData,
              experience: e.target.value,
            })
          }
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Complete Signup
      </Button>
    </form>
  );

  const renderBusinessForm = () => (
    <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyDescription">Company Description</Label>
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyWebsite">Company Website</Label>
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
        />
      </div>
      <Button type="submit" className="w-full">
        Complete Signup
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
    <Card className="w-full max-w-md mx-auto">
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
            className="mt-4 w-full"
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
