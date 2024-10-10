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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const SignupForm: React.FC = () => {
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

      console.log("Signup successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", userData.role);
      router.push(`/${userData.role}-profile`);
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

  const addPosition = () => {
    setRoleSpecificData({
      ...roleSpecificData,
      positions: [
        ...(roleSpecificData.positions || []),
        {
          title: "",
          institution: "",
          startYear: "",
          endYear: "",
          current: false,
        },
      ],
    });
  };

  const updatePosition = (
    index: number,
    field: keyof Position,
    value: string | boolean
  ) => {
    const newPositions = [...(roleSpecificData.positions || [])];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newPositions[index] as any)[field] = value;
    setRoleSpecificData({ ...roleSpecificData, positions: newPositions });
  };

  const removePosition = (index: number) => {
    const newPositions = [...(roleSpecificData.positions || [])];
    newPositions.splice(index, 1);
    setRoleSpecificData({ ...roleSpecificData, positions: newPositions });
  };

  const addAchievement = () => {
    setRoleSpecificData({
      ...roleSpecificData,
      achievements: [
        ...(roleSpecificData.achievements || []),
        { year: "", description: "" },
      ],
    });
  };

  const updateAchievement = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const newAchievements = [...(roleSpecificData.achievements || [])];
    newAchievements[index][field] = value;
    setRoleSpecificData({ ...roleSpecificData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    const newAchievements = [...(roleSpecificData.achievements || [])];
    newAchievements.splice(index, 1);
    setRoleSpecificData({ ...roleSpecificData, achievements: newAchievements });
  };

  const addResearchHighlight = () => {
    setRoleSpecificData({
      ...roleSpecificData,
      researchHighlights: [
        ...(roleSpecificData.researchHighlights || []),
        { title: "", status: "ONGOING" },
      ],
    });
  };

  const updateResearchHighlight = (
    index: number,
    field: keyof ResearchHighlight,
    value: string
  ) => {
    const newResearchHighlights = [
      ...(roleSpecificData.researchHighlights || []),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newResearchHighlights[index][field] = value as any;
    setRoleSpecificData({
      ...roleSpecificData,
      researchHighlights: newResearchHighlights,
    });
  };

  const removeResearchHighlight = (index: number) => {
    const newResearchHighlights = [
      ...(roleSpecificData.researchHighlights || []),
    ];
    newResearchHighlights.splice(index, 1);
    setRoleSpecificData({
      ...roleSpecificData,
      researchHighlights: newResearchHighlights,
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
        required
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
      <Link
        href="/login"
        className="text-primary text-sm text-center block mt-2 mb-4 hover:underline"
      >
        Already have an account? Log In
      </Link>
      <Button type="submit" className="w-full">
        Next
        <User2Icon className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );

  const renderRoleSpecificForm = () => {
    const commonFields = (
      <>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
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
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
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
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image</Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </>
    );

    const renderEducation = () => (
      <div className="space-y-2">
        <Label>Education</Label>
        {roleSpecificData.education?.map((edu, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
            />
            <Input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
            />
            <Input
              placeholder="Passing Year"
              value={edu.passingYear}
              onChange={(e) =>
                updateEducation(index, "passingYear", e.target.value)
              }
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
    );

    const renderPositions = () => (
      <div className="space-y-2">
        <Label>Positions Held</Label>
        {roleSpecificData.positions?.map((pos, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Title"
              value={pos.title}
              onChange={(e) => updatePosition(index, "title", e.target.value)}
            />
            <Input
              placeholder="Institution"
              value={pos.institution}
              onChange={(e) =>
                updatePosition(index, "institution", e.target.value)
              }
            />
            <Input
              placeholder="Start Year"
              value={pos.startYear}
              onChange={(e) =>
                updatePosition(index, "startYear", e.target.value)
              }
            />
            <Input
              placeholder="End Year"
              value={pos.endYear}
              onChange={(e) => updatePosition(index, "endYear", e.target.value)}
            />
            <Checkbox
              checked={pos.current}
              onCheckedChange={(checked) =>
                updatePosition(index, "current", checked as boolean)
              }
            />
            <Label htmlFor={`current-${index}`}>Current</Label>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removePosition(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addPosition}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Position
        </Button>
      </div>
    );

    const renderAchievements = () => (
      <div className="space-y-2">
        <Label>Achievements</Label>
        {roleSpecificData.achievements?.map((achievement, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Year"
              value={achievement.year}
              onChange={(e) => updateAchievement(index, "year", e.target.value)}
            />
            <Input
              placeholder="Description"
              value={achievement.description}
              onChange={(e) =>
                updateAchievement(index, "description", e.target.value)
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeAchievement(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addAchievement}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
        </Button>
      </div>
    );

    const renderResearchHighlights = () => (
      <div className="space-y-2">
        <Label>Research Highlights</Label>
        {roleSpecificData.researchHighlights?.map((highlight, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              placeholder="Title"
              value={highlight.title}
              onChange={(e) =>
                updateResearchHighlight(index, "title", e.target.value)
              }
            />
            <Select
              value={highlight.status}
              onValueChange={(value) =>
                updateResearchHighlight(index, "status", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeResearchHighlight(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addResearchHighlight}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Research Highlight
        </Button>
      </div>
    );

    switch (userData.role) {
      case "student":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
            {renderEducation()}
            <div className="space-y-2">
              <Label htmlFor="university">University/College Name</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course Name (Degree)</Label>
              <Input
                id="course"
                type="text"
                placeholder="Computer Science (B.Tech)"
                value={roleSpecificData.course || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    course: e.target.value,
                  })
                }
                required
              />
            </div>
            {renderResearchHighlights()}
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
              />
            </div>
            {renderAchievements()}
            <Button type="submit" className="w-full">
              Complete Signup
            </Button>
          </form>
        );
      case "professor":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
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
              <Label htmlFor="university">Current Institution</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Current Position</Label>
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
            {renderPositions()}
            <div className="space-y-2">
              <Label htmlFor="researchInterests">Research Interests</Label>
              <Textarea
                id="researchInterests"
                value={roleSpecificData.researchInterests || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    researchInterests: e.target.value,
                  })
                }
                required
              />
            </div>
            {renderAchievements()}
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
      case "business":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}
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
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={roleSpecificData.description || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
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
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <User2Icon className="w-6 h-6 inline-block mr-2" />
          {step === 1 ? "Create Your Account" : `${userData.role} Profile`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 ? renderInitialForm() : renderRoleSpecificForm()}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
};
