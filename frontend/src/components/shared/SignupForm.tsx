"use client"
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

type UserRole = "student" | "professor" | "business";

interface UserData {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Position {
  title: string;
  institution: string;
  startYear: string;
  endYear: string;
}

interface Achievement {
  year: string;
  description: string;
}

interface RoleSpecificData {
  phoneNumber: string;
  location: string;
  profileImage: File | null;
  education?: Education[];
  positions?: Position[];
  achievements?: Achievement[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
    positions: [],
    achievements: [],
  });
  const router = useRouter();

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRoleSpecificSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User Data:", userData);
    console.log("Role Specific Data:", roleSpecificData);
    router.push(`/${userData.role}-profile`);
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
        { degree: "", institution: "", year: "" },
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
        { title: "", institution: "", startYear: "", endYear: "" },
      ],
    });
  };

  const updatePosition = (
    index: number,
    field: keyof Position,
    value: string
  ) => {
    const newPositions = [...(roleSpecificData.positions || [])];
    newPositions[index][field] = value;
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

  const renderInitialForm = () => (
    <form className="space-y-4" onSubmit={handleInitialSubmit}>
      <Input
        type="text"
        placeholder="Full Name"
        value={userData.fullName}
        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
      />
      <Input
        type="email"
        placeholder="Email Address"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
        className="text-primary text-sm text-center block  mt-2 mb-4 hover:underline  
      "
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
              placeholder="Year"
              value={edu.year}
              onChange={(e) => updateEducation(index, "year", e.target.value)}
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

    switch (userData.role) {
      case "student":
        return (
          <form className="space-y-4" onSubmit={handleRoleSpecificSubmit}>
            {commonFields}

            {renderEducation()}
            <div className="space-y-2">
              <Label htmlFor="univeristy/college name">
                University/College Name
              </Label>
              <Input
                id="univeristy/college name"
                type="text"
                value={roleSpecificData.univeristy || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    univeristy: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course name">Course Name(Degree)</Label>
              <Input
                id="course name"
                type="text"
                placeholder="Computer Science (B.Tech)"
                value={roleSpecificData.course || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    course: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="researchHighlights">Research Highlights</Label>
              <Textarea
                id="researchHighlights"
                value={roleSpecificData.researchHighlights || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    researchHighlights: e.target.value,
                  })
                }
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
              <Label htmlFor="institution">Current Institution</Label>
              <Input
                id="institution"
                type="text"
                value={roleSpecificData.institution || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    institution: e.target.value,
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
              <Label htmlFor="interests">Areas of Interest</Label>
              <Textarea
                id="interests"
                value={roleSpecificData.interests || ""}
                onChange={(e) =>
                  setRoleSpecificData({
                    ...roleSpecificData,
                    interests: e.target.value,
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
      </CardContent>
    </Card>
  );
};
