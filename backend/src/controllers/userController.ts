import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import type { UserRole } from "../types/auth";
import cloudinary from "../config/cloudinary";
import { unlinkSync } from "fs";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
  files?: Express.Multer.File[];
}

// Helper function to safely parse JSON
const safeJSONParse = (value: any) => {
  if (!value) return [];
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.warn("JSON parse failed:", e);
    return [];
  }
};

// Helper function to clean up uploaded file
const cleanupUploadedFile = (file?: Express.Multer.File | { path: string }) => {
  if (file?.path) {
    // Skip cleanup if the path is a URL (from Cloudinary)
    if (file.path.startsWith('http')) {
      return;
    }
    
    try {
      unlinkSync(file.path);
    } catch (error) {
      console.warn("File cleanup failed:", error);
    }
  }
};

export const updateStudent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const file = req.file;

  try {
    const { id } = req.params;
    const userData = req.body;

    // Authorization check
    if (!req.user || req.user.id !== id || req.user.role !== "student") {
      cleanupUploadedFile(file);
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    // Handle file upload
    let imageUrl: string | undefined = undefined;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrl = result.secure_url;
      } finally {
        cleanupUploadedFile(file);
      }
    }

    // Parse nested arrays
    const education = safeJSONParse(userData.education);
    const achievements = safeJSONParse(userData.achievements);
    // const researchHighlights = safeJSONParse(userData.researchHighlights);

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        university: userData.university,
        course: userData.course,
        experience: userData.experience,
        ...(imageUrl && { imageUrl }),
        education: {
          deleteMany: {},
          create: education.map((edu: any) => ({
            degree: edu.degree,
            institution: edu.institution,
            passingYear: edu.passingYear,
          })),
        },
        achievements: {
          deleteMany: {},
          create: achievements.map((achievement: any) => ({
            title: achievement.title,
            description: achievement.description,
            year: achievement.year,
          })),
        },
        // researchHighlights: {
        //   deleteMany: {},
        //   create: researchHighlights.map((highlight: any) => ({
        //     title: highlight.title,
        //     description: highlight.description,
        //     status: highlight.status,
        //   })),
        // },
        skills: Array.isArray(userData.skills) ? userData.skills : JSON.parse(userData.skills)
      },
      include: {
        education: true,
        achievements: true,
        // researchHighlights: true,
      },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    cleanupUploadedFile(file);
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student profile" });
  }
};

export const updateProfessor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const file = req.file;
  try {
    const { id } = req.params;
    const userData = req.body;

    // Authorization check
    if (!req.user || req.user.id !== id || req.user.role !== "professor") {
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    // Handle file upload
    let photoUrl: string | undefined = undefined;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        photoUrl = result.secure_url;
      } finally {
        cleanupUploadedFile(file);
      }
    }

    // Parse nested arrays
    const positions = safeJSONParse(userData.positions);
    const achievements = safeJSONParse(userData.achievements);
    const researchInterests = safeJSONParse(userData.researchInterests);
    const tags = safeJSONParse(userData.tags);

    // Map images to research interests based on index
    let researchInterestImagesMap: { [key: number]: string[] } = {};
    // if (files && files.length > 0) {
    //   files.forEach((file) => {
    //     const match = file.fieldname.match(/researchInterestImages\[(\d+)\]/);
    //     if (match) {
    //       const index = parseInt(match[1], 10);
    //       if (!researchInterestImagesMap[index]) {
    //         researchInterestImagesMap[index] = [];
    //       }
    //       researchInterestImagesMap[index].push(file.path);
    //     }
    //   });
    // }

    // Upload images and map URLs
    for (const [index, paths] of Object.entries(researchInterestImagesMap)) {
      const uploadedUrls = [];
      for (const path of paths) {
        try {
          const result = await cloudinary.uploader.upload(path);
          uploadedUrls.push(result.secure_url);
        } finally {
          cleanupUploadedFile({ path } as Express.Multer.File);
        }
      }
      researchInterests[parseInt(index, 10)].imageUrl = uploadedUrls;
    }

    const updatedProfessor = await prisma.professor.update({
      where: { id },
      data: {
        fullName: userData.fullName,
        bio: userData.bio,
        googleScholar: userData.googleScholar,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        title: userData.title,
        university: userData.university,
        website: userData.website,
        degree: userData.degree,
        department: userData.department,
        position: userData.position,
        ...(photoUrl && { photoUrl }),

        // Update positions
        positions: {
          deleteMany: {},
          create: positions.map((pos: any) => ({
            title: pos.title,
            institution: pos.institution,
            startYear: pos.startYear,
            endYear: pos.endYear || null,
            current: pos.current || false,
          })),
        },

        // Update achievements
        achievements: {
          deleteMany: {},
          create: achievements.map((achievement: any) => ({
            title: achievement.title,
            description: achievement.description,
            year: achievement.year,
          })),
        },

        // Update research interests with multiple images
        researchInterests: {
          deleteMany: {},
          create: researchInterests.map((interest: any) => ({
            title: interest.title,
            description: interest.description || null,
            imageUrl: interest.imageUrl || [],
          })),
        },

        // Update tags
        tags: {
          deleteMany: {},
          create: tags.map((tag: any) => ({
            category: tag.category,
            subcategory: tag.subcategory,
          })),
        },
      },
      include: {
        positions: true,
        achievements: true,
        researchInterests: true,
        tags: true,
      },
    });

    res.status(200).json(updatedProfessor);
  } catch (error) {
    console.error("Error updating professor:", error);
    res.status(500).json({ error: "Failed to update professor profile" });
  }
};
export const updateBusiness = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const file = req.file;

  try {
    const { id } = req.params;
    const userData = req.body;

    // Authorization check
    if (!req.user || req.user.id !== id || req.user.role !== "business") {
      cleanupUploadedFile(file);
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    // Handle file upload
    let profileImageUrl: string | undefined = undefined;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        profileImageUrl = result.secure_url;
      } finally {
        cleanupUploadedFile(file);
      }
    }

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: {
        companyName: userData.companyName,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        industry: userData.industry,
        description: userData.description,
        website: userData.website,
        ...(profileImageUrl && { profileImageUrl }),
      },
    });

    res.status(200).json(updatedBusiness);
  } catch (error) {
    cleanupUploadedFile(file);
    console.error("Error updating business:", error);
    res.status(500).json({ error: "Failed to update business profile" });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Auth middleware should have already verified and added user to req
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id, role } = req.user;
    
    let userData;
    
    // Fetch the appropriate user type based on role
    switch (role) {
      case "student":
        userData = await prisma.student.findUnique({
          where: { id },
          include: {
            education: true,
            achievements: true,
          }
        });
        break;
      case "professor":
        userData = await prisma.professor.findUnique({
          where: { id },
          include: {
            positions: true,
            achievements: true,
            researchInterests: true,
            tags: true,
          }
        });
        break;
      case "business":
        userData = await prisma.business.findUnique({
          where: { id }
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid user role" });
    }

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include the role in the response
    res.status(200).json({ ...userData, role });
    
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch user information" });
  }
};