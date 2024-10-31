import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import axios from "axios";

interface PatentsTabProps {
  isLoggedInUser: boolean;
  patents: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string[];
    createdAt: string;
  }>;
  API_URL: string;
}

const PatentsTab: React.FC<PatentsTabProps> = ({
  isLoggedInUser,
  patents,
  API_URL,
}) => {
  const [isPatentDialogOpen, setIsPatentDialogOpen] = useState(false);
  const [isCreatingPatent, setIsCreatingPatent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setError("Maximum 4 images allowed");
      e.target.value = "";
      setSelectedFiles([]);
      setImagePreview([]);
      return;
    }

    if (files.length === 0) {
      setError("At least one image is required");
      setSelectedFiles([]);
      setImagePreview([]);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.every((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isImage && isValidSize;
    });

    if (!validFiles) {
      setError("Please ensure all files are images under 5MB");
      e.target.value = "";
      setSelectedFiles([]);
      setImagePreview([]);
      return;
    }

    setSelectedFiles(files);
    setError(null);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleCreatePatent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingPatent(true);
    setError(null);

    try {
      const form = e.currentTarget;
      const titleInput = form.elements.namedItem("title") as HTMLInputElement;
      const descriptionInput = form.elements.namedItem(
        "description"
      ) as HTMLTextAreaElement;

      // Frontend validation
      if (!titleInput.value || !descriptionInput.value) {
        throw new Error("Please fill in all required fields");
      }

      if (selectedFiles.length === 0) {
        throw new Error("At least one image is required");
      }

      if (selectedFiles.length > 4) {
        throw new Error("Maximum 4 images allowed");
      }

      const formData = new FormData();
      formData.append("title", titleInput.value);
      formData.append("description", descriptionInput.value);
      formData.append("professorId", localStorage.getItem("userId") || "");

      // Append each file with the same field name
      selectedFiles.forEach((file) => {
        formData.append("patentImages", file);
      });

      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/patents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear form and close dialog on success
      setIsPatentDialogOpen(false);
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
      setImagePreview([]);
      setSelectedFiles([]);
      window.location.reload();
    } catch (error) {
      console.error("Error creating patent:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Failed to create patent. Please try again."
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create patent. Please try again.");
      }
    } finally {
      setIsCreatingPatent(false);
    }
  };

  const getImageGridLayout = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-1";
    }
  };

  const getImageAspectRatio = (imageCount: number, index: number) => {
    if (imageCount === 1) return "aspect-video w-full";
    if (imageCount === 2) return "aspect-square w-full";
    if (imageCount === 3)
      return index === 0 ? "aspect-video col-span-2" : "aspect-square";
    if (imageCount === 4) return "aspect-square w-full";
    return "aspect-square w-full";
  };

  return (
    <Card className="border-2 border-[#c1502e]/20 bg-white shadow-md">
      <CardHeader className="border-b border-[#c1502e]/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-2xl font-bold text-[#472014]">
            <BookOpen className="mr-3 h-6 w-6 text-[#c1502e]" />
            Patents
          </CardTitle>
          {isLoggedInUser && (
            <Dialog
              open={isPatentDialogOpen}
              onOpenChange={setIsPatentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#c1502e] text-white hover:bg-[#472014]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Patent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Patent</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePatent}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        Description (max 200 words)
                      </Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="patentImages">
                        Images (1-4 images required)
                      </Label>
                      <Input
                        id="patentImages"
                        name="patentImages"
                        type="file"
                        multiple
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                      />
                      {imagePreview.length > 0 && (
                        <div
                          className={`grid gap-2 ${getImageGridLayout(
                            imagePreview.length
                          )}`}
                        >
                          {imagePreview.map((url, index) => (
                            <div
                              key={index}
                              className={`relative ${getImageAspectRatio(
                                imagePreview.length,
                                index
                              )}`}
                            >
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsPatentDialogOpen(false);
                        imagePreview.forEach((url) => URL.revokeObjectURL(url));
                        setImagePreview([]);
                        setSelectedFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#c1502e] text-white hover:bg-[#472014]"
                      disabled={isCreatingPatent}
                    >
                      {isCreatingPatent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Patent"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {patents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patents.map((patent) => (
              <Card key={patent.id} className="overflow-hidden">
                <div
                  className={`grid gap-2 ${getImageGridLayout(
                    patent.imageUrl.length
                  )}`}
                >
                  {patent.imageUrl.map((url, index) => (
                    <div
                      key={index}
                      className={`relative ${getImageAspectRatio(
                        patent.imageUrl.length,
                        index
                      )}`}
                    >
                      <Image
                        src={url}
                        alt={`${patent.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-[#472014]">
                    {patent.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {patent.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Created on {new Date(patent.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            No patents available.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatentsTab;
