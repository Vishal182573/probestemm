/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, SaveIcon, PlusCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from "@/constants";
import NavbarWithBg from "@/components/shared/NavbarWithbg";
import { Footer } from "@/components/shared/Footer";

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

// Add interfaces for research interests and tags
interface ResearchInterest {
  title: string;
  description: string;
  image?: File;
  imagePreview?: string;
  imageUrl?: string;
}

interface Tag {
  category: string;
  subcategory: string;
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

interface Education {
  degree: string;
  institution: string;
  passingYear: string;
}

interface ResearchHighlight {
  title: string;
  status: "ONGOING" | "COMPLETED";
}

const EditProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newResearchInterest, setNewResearchInterest] =
    useState<ResearchInterest>({
      title: "",
      description: "",
    });

  // Move localStorage access to useEffect
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Education handlers
  const addEducation = () => {
    setProfileData((prev: any) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: "", institution: "", passingYear: "" } as Education,
      ],
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...profileData.education];
    newEducation[index][field] = value;
    setProfileData({ ...profileData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    const newEducation = [...profileData.education];
    newEducation.splice(index, 1);
    setProfileData({ ...profileData, education: newEducation });
  };

  // Position handlers
  const addPosition = () => {
    setProfileData((prev: any) => ({
      ...prev,
      positions: [
        ...(prev.positions || []),
        {
          title: "",
          institution: "",
          startYear: "",
          endYear: "",
          current: false,
        },
      ],
    }));
  };

  const updatePosition = (
    index: number,
    field: keyof Position,
    value: string | boolean
  ) => {
    const newPositions = [...profileData.positions];
    newPositions[index][field] = value;
    setProfileData({ ...profileData, positions: newPositions });
  };

  const removePosition = (index: number) => {
    const newPositions = [...profileData.positions];
    newPositions.splice(index, 1);
    setProfileData({ ...profileData, positions: newPositions });
  };

  // Achievement handlers
  const addAchievement = () => {
    setProfileData((prev: any) => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        { year: "", description: "" },
      ],
    }));
  };

  const updateAchievement = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const newAchievements = [...profileData.achievements];
    newAchievements[index][field] = value;
    setProfileData({ ...profileData, achievements: newAchievements });
  };

  const removeAchievement = (index: number) => {
    const newAchievements = [...profileData.achievements];
    newAchievements.splice(index, 1);
    setProfileData({ ...profileData, achievements: newAchievements });
  };

  // Research highlight handlers
  const addResearchHighlight = () => {
    setProfileData((prev: any) => ({
      ...prev,
      researchHighlights: [
        ...(prev.researchHighlights || []),
        { title: "", status: "ONGOING" },
      ],
    }));
  };

  const updateResearchHighlight = (
    index: number,
    field: keyof ResearchHighlight,
    value: string
  ) => {
    const newHighlights = [...profileData.researchHighlights];
    newHighlights[index][field] = value;
    setProfileData({ ...profileData, researchHighlights: newHighlights });
  };

  const removeResearchHighlight = (index: number) => {
    const newHighlights = [...profileData.researchHighlights];
    newHighlights.splice(index, 1);
    setProfileData({ ...profileData, researchHighlights: newHighlights });
  };

  const addResearchInterest = () => {
    if (newResearchInterest.title && newResearchInterest.description) {
      setProfileData((prev: any) => ({
        ...prev,
        researchInterests: [
          ...(prev.researchInterests || []),
          newResearchInterest,
        ],
      }));
      setNewResearchInterest({ title: "", description: "" });
    }
  };

  const removeResearchInterest = (index: number) => {
    const newInterests = [...profileData.researchInterests];
    newInterests.splice(index, 1);
    setProfileData({ ...profileData, researchInterests: newInterests });
  };

  // Add tag handlers
  const addTag = (category: string, subcategory: string) => {
    if (category && subcategory) {
      setProfileData((prev: any) => ({
        ...prev,
        tags: [...(prev.tags || []), { category, subcategory }],
      }));
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...profileData.tags];
    newTags.splice(index, 1);
    setProfileData({ ...profileData, tags: newTags });
  };

  // Modify fetchProfileData to depend on userId and role being set
  useEffect(() => {
    if (userId && role) {
      fetchProfileData();
    }
  }, [userId, role]);

  const fetchProfileData = async () => {
    try {
      if (typeof window === "undefined") return; // Guard against server-side execution

      const token = localStorage.getItem("token");
      if (!token || !userId || !role) return;

      const response = await fetch(`${API_URL}/${role}s/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
      setImagePreview(data.photoUrl || data.profileImageUrl);
    } catch (error: any) {
      toast({
        title: error,
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    }
  };

  // components/EditProfileForm.tsx (Client-Side)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (!token || !userId || !role) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();

      // Add profile image
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // Add research interest images with indexed field names
      profileData.researchInterests.forEach(
        (interest: ResearchInterest, index: number) => {
          if (interest.image) {
            formData.append(`researchInterestImages[${index}]`, interest.image);
          }
        }
      );

      // Add the rest of the profile data
      Object.entries(profileData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${API_URL}/user/${role}s/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      await fetchProfileData();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="bg-white text-black">
      {userId && role ? (
        <>
          <NavbarWithBg />
          <Card className="w-full min-h-screen bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
              <CardTitle className="text-2xl font-bold text-black">
                Profile Settings
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? (
                  "Cancel"
                ) : (
                  <>
                    <PencilIcon className="mr-2 h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 text-black bg-white">
                {/* Profile Image */}
                <div className="space-y-2">
                  {imagePreview && (
                    <div className="relative w-24 h-24">
                      <Image
                        src={imagePreview}
                        alt="Profile"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full text-black bg-white"
                      />
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 text-black bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Common Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData?.fullName || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-black bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData?.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-black bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profileData?.location || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="text-black bg-white"
                    />
                  </div>
                </div>

                {/* Role-specific Fields */}
                {role === "student" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="university">University/Institution</Label>
                      <Input
                        id="university"
                        name="university"
                        value={profileData?.university || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        name="course"
                        value={profileData?.course || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    {/* Education Section */}
                    <div className="space-y-2">
                      <Label>Education History</Label>
                      {profileData?.education?.map(
                        (edu: Education, index: number) => (
                          <div
                            key={index}
                            className="flex gap-2 p-4 bg-secondary/20 rounded-lg"
                          >
                            <Input
                              placeholder="Degree"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(index, "degree", e.target.value)
                              }
                              disabled={!isEditing}
                              className="flex-1 text-black bg-white"
                            />
                            <Input
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              disabled={!isEditing}
                              className="flex-1 text-black bg-white"
                            />
                            <Input
                              placeholder="Year"
                              value={edu.passingYear}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "passingYear",
                                  e.target.value
                                )
                              }
                              disabled={!isEditing}
                              className="flex-1 text-black bg-white"
                            />
                            {isEditing && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeEducation(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      )}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addEducation}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                      )}
                    </div>

                    {/* Research Highlights */}
                    <div className="space-y-2">
                      <Label>Research Highlights</Label>
                      {profileData?.researchHighlights?.map(
                        (highlight: ResearchHighlight, index: number) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Research Title"
                              value={highlight.title}
                              onChange={(e) =>
                                updateResearchHighlight(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              disabled={!isEditing}
                              className="flex-1 text-black bg-white"
                            />
                            <Select
                              value={highlight.status}
                              onValueChange={(value) =>
                                updateResearchHighlight(index, "status", value)
                              }
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white">
                                <SelectItem value="ONGOING">Ongoing</SelectItem>
                                <SelectItem value="COMPLETED">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {isEditing && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeResearchHighlight(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      )}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addResearchHighlight}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Research
                          Highlight
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {role === "professor" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Designation</Label>
                      <Input
                        id="title"
                        name="title"
                        value={profileData?.title || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    {/* Bio Field */}
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData?.bio || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        value={profileData?.degree || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    {/* Google Scholar Field */}
                    <div>
                      <Label htmlFor="googleScholar">Google Scholar URL</Label>
                      <Input
                        id="googleScholar"
                        name="googleScholar"
                        type="url"
                        value={profileData?.googleScholar || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    {/* Research Interests Section */}
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
                          disabled={!isEditing}
                          className="text-black bg-white"
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
                          disabled={!isEditing}
                          className="text-black bg-white"
                        />
                        {isEditing && (
                          <div className="flex flex-col space-y-2">
                            <Label>Upload Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const previewUrl = URL.createObjectURL(file);
                                  setNewResearchInterest({
                                    ...newResearchInterest,
                                    image: file,
                                    imagePreview: previewUrl,
                                  });
                                }
                              }}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-black bg-white"
                            />
                          </div>
                        )}
                        {newResearchInterest.imagePreview && (
                          <div className="relative w-40 h-40">
                            <Image
                              src={newResearchInterest.imagePreview}
                              alt="Preview"
                              width={160}
                              height={160}
                              className="rounded-md object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                if (newResearchInterest.imagePreview) {
                                  URL.revokeObjectURL(
                                    newResearchInterest.imagePreview
                                  );
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
                        {isEditing && (
                          <Button type="button" onClick={addResearchInterest}>
                            Add Research Interest
                          </Button>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData?.researchInterests?.map(
                          (interest: ResearchInterest, index: number) => (
                            <div
                              key={index}
                              className="bg-primary/10 p-4 rounded-md flex flex-col space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {interest.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {interest.description}
                                  </p>
                                </div>
                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeResearchInterest(index)
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              {(interest.imageUrl || interest.imagePreview) && (
                                <div className="relative w-full h-48">
                                  <Image
                                    src={
                                      interest.imageUrl ||
                                      interest.imagePreview ||
                                      ""
                                    }
                                    alt={interest.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      {isEditing && (
                        <div className="flex space-x-2">
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
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
                            onValueChange={(subcategory) =>
                              addTag(selectedCategory, subcategory)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Subcategory" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white">
                              {selectedCategory &&
                                categories[
                                  selectedCategory as keyof typeof categories
                                ].map((subcategory) => (
                                  <SelectItem
                                    key={subcategory}
                                    value={subcategory}
                                  >
                                    {subcategory}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData?.tags?.map((tag: Tag, index: number) => (
                          <div
                            key={index}
                            className="bg-primary/10 px-2 py-1 rounded-md flex items-center gap-2"
                          >
                            {tag.category} - {tag.subcategory}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={profileData?.department || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-black bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="university">University/Institution</Label>
                  <Input
                    id="university"
                    name="university"
                    value={profileData?.university || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-black bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Positions Held</Label>
                  {profileData?.positions?.map(
                    (pos: Position, index: number) => (
                      <div
                        key={index}
                        className="flex gap-2 p-4 bg-secondary/20 rounded-lg"
                      >
                        <Input
                          placeholder="Title"
                          value={pos.title}
                          onChange={(e) =>
                            updatePosition(index, "title", e.target.value)
                          }
                          disabled={!isEditing}
                          className="flex-1 text-black bg-white"
                        />
                        <Input
                          placeholder="Institution"
                          value={pos.institution}
                          onChange={(e) =>
                            updatePosition(index, "institution", e.target.value)
                          }
                          disabled={!isEditing}
                          className="flex-1 text-black bg-white"
                        />
                        <Select
                          value={pos.startYear}
                          onValueChange={(value) =>
                            updatePosition(index, "startYear", value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Start Year" />
                          </SelectTrigger>
                          <SelectContent className="text-black bg-white">
                            {getYearOptions().map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={pos.endYear}
                          onValueChange={(value) =>
                            updatePosition(index, "endYear", value)
                          }
                          disabled={!isEditing || pos.current}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="End Year" />
                          </SelectTrigger>
                          <SelectContent className="text-black bg-white">
                            {getYearOptions().map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={pos.current}
                            onCheckedChange={(checked) =>
                              updatePosition(
                                index,
                                "current",
                                checked as boolean
                              )
                            }
                            disabled={!isEditing}
                            className="text-black bg-white"
                          />
                          <Label>Current</Label>
                        </div>
                        {isEditing && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removePosition(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      className="text-black bg-white"
                      onClick={addPosition}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Position
                    </Button>
                  )}
                </div>
                {/* Website Field */}
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={profileData?.website || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="text-black bg-white"
                  />
                </div>

                {role === "business" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={profileData?.companyName || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={profileData?.industry || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={profileData?.description || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Company Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={profileData?.website || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Achievements Section - Common for all roles */}
                <div className="space-y-2">
                  <Label>Achievements</Label>
                  {profileData?.achievements?.map(
                    (achievement: Achievement, index: number) => (
                      <div
                        key={index}
                        className="flex gap-2 p-4 bg-secondary/20 rounded-lg"
                      >
                        <Input
                          placeholder="Year"
                          value={achievement.year}
                          onChange={(e) =>
                            updateAchievement(index, "year", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-32 text-black bg-white"
                        />
                        <Input
                          placeholder="Description"
                          value={achievement.description}
                          onChange={(e) =>
                            updateAchievement(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className="flex-1 text-black bg-white"
                        />
                        {isEditing && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="text-white"
                            onClick={() => removeAchievement(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAchievement}
                      className="text-black bg-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
                    </Button>
                  )}
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="pt-6">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <SaveIcon className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
              </form>
            </CardContent>
          </Card>
          <Footer />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default EditProfileForm;
