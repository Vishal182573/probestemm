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
import { ProjectCategories } from "@/lib/pre-define-data";

// Define the structure of categories and their subcategories for research fields
const categories = ProjectCategories;

// Interface definitions for type safety and data structure
interface ResearchInterest {
  title: string;
  description: string;
  images?: File[];
  imagePreviews?: string[];
  imageUrl?: string[];
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

// Main component for editing user profiles
const EditProfileForm = () => {
  // State management for form data and UI controls
  const [isEditing, setIsEditing] = useState(false);          // Controls edit mode
  const [loading, setLoading] = useState(false);              // Tracks form submission state
  const [error, setError] = useState<string | null>(null);    // Stores error messages
  const [profileData, setProfileData] = useState<any>(null);  // Stores user profile data
  const [profileImage, setProfileImage] = useState<File | null>(null);  // Stores profile image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Stores profile image preview URL
  const [userId, setUserId] = useState<string | null>(null);  // Stores user ID
  const [role, setRole] = useState<string | null>(null);      // Stores user role
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Selected research category
  
  // State for new research interest form
  const [newResearchInterest, setNewResearchInterest] = useState<ResearchInterest>({
    title: '',
    description: '',
    images: [],
    imagePreviews: [],
  });

  // Initialize user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  // Handler for profile image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Add file validation
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPEG, PNG, or GIF image.",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: "Image must be smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handler for uploading multiple images for research interests
  const handleImageUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_URL}/image/upload-multiple`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const { imageUrls } = await response.json();
      return imageUrls;
    } catch (error) {
      toast({
        title: "Error uploading images",
        description: "Please try again later.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Handler for research interest image uploads
  const handleResearchImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image type.`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > maxFileSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} must be smaller than 5MB.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    const previews = validFiles.map(file => URL.createObjectURL(file));

    setNewResearchInterest(prev => ({
      ...prev,
      images: [...(prev.images || []), ...validFiles],
      imagePreviews: [...(prev.imagePreviews || []), ...previews]
    }));
  };

  // Handlers for managing research interests
  const removeImage = (index: number) => {
    setNewResearchInterest(prev => {
      const newImages = [...(prev.images || [])];
      const newPreviews = [...(prev.imagePreviews || [])];

      if (prev.imagePreviews?.[index]) {
        URL.revokeObjectURL(prev.imagePreviews[index]);
      }

      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews
      };
    });
  };

  const addResearchInterest = async () => {
    if (!newResearchInterest.title || !newResearchInterest.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!newResearchInterest.images?.length) {
      toast({
        title: "Missing Images",
        description: "Please upload at least one image.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload images first
      const imageUrls = await handleImageUpload(newResearchInterest.images);

      // Add research interest with image URLs
      setProfileData((prev: any) => ({
        ...prev,
        researchInterests: [
          ...(prev.researchInterests || []),
          {
            title: newResearchInterest.title,
            description: newResearchInterest.description,
            imageUrl: imageUrls
          }
        ],
      }));

      // Clear form and previews
      newResearchInterest.imagePreviews?.forEach(preview => {
        URL.revokeObjectURL(preview);
      });

      setNewResearchInterest({
        title: '',
        description: '',
        images: [],
        imagePreviews: []
      });

      toast({
        title: "Success",
        description: "Research interest added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add research interest. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handlers for form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Education section handlers
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

  // Position section handlers
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

  // Achievement section handlers
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

  // Research highlight section handlers
  // const addResearchHighlight = () => {
  //   setProfileData((prev: any) => ({
  //     ...prev,
  //     researchHighlights: [
  //       ...(prev.researchHighlights || []),
  //       { title: "", status: "ONGOING" },
  //     ],
  //   }));
  // };

  // const updateResearchHighlight = (
  //   index: number,
  //   field: keyof ResearchHighlight,
  //   value: string
  // ) => {
  //   const newHighlights = [...profileData.researchHighlights];
  //   newHighlights[index][field] = value;
  //   setProfileData({ ...profileData, researchHighlights: newHighlights });
  // };

  // const removeResearchHighlight = (index: number) => {
  //   const newHighlights = [...profileData.researchHighlights];
  //   newHighlights.splice(index, 1);
  //   setProfileData({ ...profileData, researchHighlights: newHighlights });
  // };

  const removeResearchInterest = (index: number) => {
    const newInterests = [...profileData.researchInterests];
    newInterests.splice(index, 1);
    setProfileData({ ...profileData, researchInterests: newInterests });
  };

  // Tag management handlers
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

  // Fetch user profile data when userId and role are available
  useEffect(() => {
    if (userId && role) {
      fetchProfileData();
    }
  }, [userId, role]);

  // Function to fetch user profile data from API
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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (!token || !userId || !role) {
        throw new Error("Authentication failed");
      }

      const formData = new FormData();

      // Validate profile image before upload
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

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
        // Improved error handling
        const errorResponse = await response.text();
        console.error('Server error response:', errorResponse);
        throw new Error(`Failed to update profile: ${errorResponse}`);
      }

      const updatedData = await response.json();

      // Update local storage with the new user data
      localStorage.setItem("user", JSON.stringify(updatedData));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      await fetchProfileData();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "File upload failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate year options for dropdowns
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  };

  // Component render method with conditional rendering based on user role
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Navigation bar */}
      <NavbarWithBg />
      
      {/* Main content - conditionally rendered based on userId and role */}
      {userId && role ? (
        <div className="flex justify-center items-start p-0 h-screen">
          <Card className="relative overflow-y-auto h-[80vh] my p-5 bg-white my-4 lg:w-[50vw] w-full">
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

            <CardContent className="p-0">
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
                      Image must be in jpeg, jpg and png form only
                    </div>
                  )}
                </div>

                {/* Common Fields */}
                <div className="space-y-4">
                  {role !== "business" && (
                    <>
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
                    </>
                  )}

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
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={profileData?.experience || ""}
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
                          className="bg-white text-black hover:text-white m-2"
                        >
                          <PlusCircle className="h-4 w-4" /> Add Education
                        </Button>
                      )}
                    </div>
                    
                    {/* Skills  */}
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      {profileData?.skills?.map((skill: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter skill"
                            value={skill}
                            onChange={(e) => {
                              const updatedSkills = [...profileData.skills];
                              updatedSkills[index] = e.target.value;
                              setProfileData({ ...profileData, skills: updatedSkills });
                            }}
                            disabled={!isEditing}
                            className="flex-1 text-black bg-white"
                          />
                          {isEditing && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const updatedSkills = profileData.skills.filter((_: any, i: number) => i !== index);
                                setProfileData({ ...profileData, skills: updatedSkills });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const updatedSkills = [...(profileData.skills || []), ""];
                            setProfileData({ ...profileData, skills: updatedSkills });
                          }}
                          className="bg-white text-black hover:text-white m-2"
                        >
                          <PlusCircle className="h-4 w-4" /> Add Skill
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
                    <div className="space-y-4">
                      <Label>Research Interests</Label>
                      {isEditing &&
                      <div className="flex flex-col space-y-4">
                        <Input
                          placeholder="Interest Title"
                          value={newResearchInterest.title}
                          onChange={(e) => setNewResearchInterest(prev => ({
                            ...prev,
                            title: e.target.value
                          }))}
                          className="text-black bg-white"
                        />

                        <Textarea
                          placeholder="Description"
                          value={newResearchInterest.description}
                          onChange={(e) => setNewResearchInterest(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          className="text-black bg-white"
                        />

                        <div className="space-y-2">
                          <Label>Upload Images</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleResearchImageChange}
                            className="h-fit file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 text-black bg-white"
                          />
                        </div>

                        {/* Image Previews Grid */}
                        {newResearchInterest.imagePreviews && newResearchInterest.imagePreviews.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {newResearchInterest.imagePreviews.map((preview, index) => (
                              <div key={index} className="relative aspect-square">
                                <Image
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="rounded-md object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={addResearchInterest}
                          className="w-full"
                        >
                          Add Research Interest
                        </Button>
                      </div>
                      }

                      {/* Existing Research Interests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {profileData?.researchInterests?.map((interest: ResearchInterest, index: number) => (
                          <div
                            key={index}
                            className="bg-primary/10 p-4 rounded-md space-y-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{interest.title}</h4>
                                <p className="text-sm text-muted-foreground">{interest.description}</p>
                              </div>
                              {isEditing && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeResearchInterest(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {interest.imageUrl && interest.imageUrl.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {interest.imageUrl.map((url, imgIndex) => (
                                  <div key={imgIndex} className="relative aspect-square">
                                    <Image
                                      src={url}
                                      alt={`${interest.title} image ${imgIndex + 1}`}
                                      fill
                                      className="rounded-md object-cover"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
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
                {role === "professor" &&
                  <>
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

                    {role === "professor" &&
                      (<>
                        <div className="space-y-2">
                          <Label>Positions Held</Label>
                          {profileData?.positions?.map((pos: Position, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-4 p-4 bg-secondary/20 rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
                                <SelectTrigger className="w-full">
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
                                <SelectTrigger className="w-full">
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
                                  onCheckedChange={(checked) => {
                                    const currentYear = new Date().getFullYear().toString();
                                    updatePosition(index, "current", checked as boolean);

                                    if (checked) {
                                      updatePosition(index, "endYear", currentYear);
                                    } else {
                                      updatePosition(index, "endYear", "");
                                    }
                                  }}
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
                                  className="mt-2 sm:mt-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              className="text-black bg-white m-2"
                              onClick={addPosition}
                            >
                              <PlusCircle className="h-4 w-4" /> Add Position
                            </Button>
                          )}
                        </div>
                        {/* Website Field */}
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            type="text"
                            value={profileData?.website || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="text-black bg-white"
                          />
                        </div>
                      </>
                      )}
                  </>
                }

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
                      <Label htmlFor="website">Company Website / Social Media</Label>
                      <Input
                        id="website"
                        name="website"
                        type="text"
                        value={profileData?.website || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="text-black bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Achievements Section - Customized label based on role */}
                {role !== "business" && (
                  <div className="space-y-2">
                    <Label>{role === "professor" ? "Teaching Interests" : "Achievements"}</Label>
                    {profileData?.achievements?.map(
                      (achievement: Achievement, index: number) => (
                        <div
                          key={index}
                          className="flex gap-2 p-4 bg-secondary/20 rounded-lg"
                        >
                          {(role === "student" &&
                            <Input
                              placeholder="Year"
                              value={achievement.year}
                              onChange={(e) =>
                                updateAchievement(index, "year", e.target.value)
                              }
                              disabled={!isEditing}
                              className="w-32 text-black bg-white"
                            />
                          )}
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
                        className="text-black bg-white m-2"
                      >
                        <PlusCircle className="h-4 w-4" /> {role === "professor" ? "Add Teaching Interest" : "Add Achievement"}
                      </Button>
                    )}
                  </div>
                )}

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
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EditProfileForm;
