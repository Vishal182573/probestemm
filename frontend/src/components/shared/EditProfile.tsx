/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface ResearchInterest {
  title: string;
  description: string;
  imageUrl?: string;
  image?: File;
  imagePreview?: string;
}

interface EditProfileFormProps {
  role: "student" | "professor" | "business";
  userId: string;
}

const EditProfileForm = ({ role, userId }: EditProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [editingResearchInterest, setEditingResearchInterest] =
    useState<ResearchInterest>({
      title: "",
      description: "",
    });

  useEffect(() => {
    fetchProfileData();
  }, [userId, role]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${role}s/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfileData({
        ...data,
        researchInterests: data.researchInterests || [],
        tags: data.tags || [],
      });
      console.log(data);
      setImagePreview(data.photoUrl || data.profileImageUrl);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    }
  };
  const updateResearchInterest = (
    index: number,
    field: keyof ResearchInterest,
    value: string
  ) => {
    const updatedInterests = [...(profileData?.researchInterests || [])];
    updatedInterests[index] = {
      ...updatedInterests[index],
      [field]: value,
    };
    setProfileData({
      ...profileData,
      researchInterests: updatedInterests,
    });
  };

  const removeResearchInterest = (index: number) => {
    const updatedInterests = [...(profileData?.researchInterests || [])];
    updatedInterests.splice(index, 1);
    setProfileData({
      ...profileData,
      researchInterests: updatedInterests,
    });
  };
  const removeTag = (index: number) => {
    const updatedTags = [...(profileData?.tags || [])];
    updatedTags.splice(index, 1);
    setProfileData({
      ...profileData,
      tags: updatedTags,
    });
  };
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
    if (editingResearchInterest.title && editingResearchInterest.description) {
      const newResearchInterest = {
        title: editingResearchInterest.title,
        description: editingResearchInterest.description,
        imageUrl: editingResearchInterest.imagePreview,
        professorId: userId,
      };

      setProfileData({
        ...profileData,
        researchInterests: [
          ...profileData.researchInterests,
          newResearchInterest,
        ],
      });

      setEditingResearchInterest({
        title: "",
        description: "",
      });
    }
  };

  // Update the tags section to match your API response structure
  const addTag = () => {
    if (selectedCategory && selectedSubcategory) {
      const newTag = {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        professorId: userId,
      };

      setProfileData({
        ...profileData,
        tags: [...profileData.tags, newTag],
      });

      setSelectedCategory("");
      setSelectedSubcategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();

      // Add all profile data to formData
      Object.entries(profileData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add profile image if changed
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-2">
            {imagePreview && (
              <div className="relative w-24 h-24">
                <Image
                  src={imagePreview}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
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
                  className="mt-1"
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
              />
            </div>
          </div>

          {/* Role-specific Fields */}
          {role === "student" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  name="university"
                  value={profileData?.university || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
                        className="flex-1"
                      />
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Year"
                        value={edu.passingYear}
                        onChange={(e) =>
                          updateEducation(index, "passingYear", e.target.value)
                        }
                        disabled={!isEditing}
                        className="flex-1"
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
                        className="flex-1"
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
                        <SelectContent>
                          <SelectItem value="ONGOING">Ongoing</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
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
                <Label htmlFor="title">Academic Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={profileData?.title || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-4">
                <Label>Research Interests</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData?.researchInterests?.map(
                    (interest: any, index: number) => (
                      <div
                        key={index}
                        className="bg-secondary/20 p-4 rounded-lg space-y-2"
                      >
                        {isEditing ? (
                          <>
                            <Input
                              value={interest.title}
                              onChange={(e) =>
                                updateResearchInterest(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Interest Title"
                              className="mb-2"
                            />
                            <Textarea
                              value={interest.description}
                              onChange={(e) =>
                                updateResearchInterest(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Description"
                              className="mb-2"
                            />
                          </>
                        ) : (
                          <>
                            <h4 className="font-medium">{interest.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {interest.description}
                            </p>
                          </>
                        )}

                        {interest.imageUrl && (
                          <div className="relative w-full h-48">
                            <Image
                              src={interest.imageUrl}
                              alt={interest.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}

                        {isEditing && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeResearchInterest(index)}
                            className="mt-2"
                          >
                            <X className="h-4 w-4 mr-2" /> Remove
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Add New Research Interest Form */}
              {isEditing && (
                <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
                  <Input
                    placeholder="New Interest Title"
                    value={editingResearchInterest.title}
                    onChange={(e) =>
                      setEditingResearchInterest({
                        ...editingResearchInterest,
                        title: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="New Interest Description"
                    value={editingResearchInterest.description}
                    onChange={(e) =>
                      setEditingResearchInterest({
                        ...editingResearchInterest,
                        description: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setEditingResearchInterest({
                          ...editingResearchInterest,
                          image: file,
                          imagePreview: previewUrl,
                        });
                      }
                    }}
                    className="mt-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addResearchInterest}
                    disabled={
                      !editingResearchInterest.title ||
                      !editingResearchInterest.description
                    }
                    className="mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Research
                    Interest
                  </Button>
                </div>
              )}

              {/* Tags Section */}
              <div className="space-y-4">
                <Label>Research Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData?.tags?.map((tag: any, index: number) => (
                    <div
                      key={index}
                      className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">
                        {tag.category} - {tag.subcategory}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(categories).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <Select
                        value={selectedSubcategory}
                        onValueChange={setSelectedSubcategory}
                        disabled={!selectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory &&
                            categories[
                              selectedCategory as keyof typeof categories
                            ].map((subcategory) => (
                              <SelectItem key={subcategory} value={subcategory}>
                                {subcategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      disabled={!selectedCategory || !selectedSubcategory}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Tag
                    </Button>
                  </div>
                )}
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
            />
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              name="university"
              value={profileData?.university || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          {/* Positions Section */}
          <div className="space-y-2">
            <Label>Academic Positions</Label>
            {profileData?.positions?.map((pos: Position, index: number) => (
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
                  className="flex-1"
                />
                <Input
                  placeholder="Institution"
                  value={pos.institution}
                  onChange={(e) =>
                    updatePosition(index, "institution", e.target.value)
                  }
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Input
                  placeholder="Start Year"
                  value={pos.startYear}
                  onChange={(e) =>
                    updatePosition(index, "startYear", e.target.value)
                  }
                  disabled={!isEditing}
                  className="flex-1"
                />
                <Input
                  placeholder="End Year"
                  value={pos.endYear}
                  onChange={(e) =>
                    updatePosition(index, "endYear", e.target.value)
                  }
                  disabled={!isEditing || pos.current}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={pos.current}
                    onCheckedChange={(checked) =>
                      updatePosition(index, "current", checked as boolean)
                    }
                    disabled={!isEditing}
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
            ))}
            {isEditing && (
              <Button type="button" variant="outline" onClick={addPosition}>
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
                    className="w-32"
                  />
                  <Input
                    placeholder="Description"
                    value={achievement.description}
                    onChange={(e) =>
                      updateAchievement(index, "description", e.target.value)
                    }
                    disabled={!isEditing}
                    className="flex-1"
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            )}
            {isEditing && (
              <Button type="button" variant="outline" onClick={addAchievement}>
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

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
