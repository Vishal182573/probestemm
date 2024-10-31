import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { NotificationType, PrismaClient } from "@prisma/client";
import { createNotification } from "./notificationController";
import { Readable } from "stream";
import { FRONTEND_URL } from "../constants";

interface FileRequest extends Request {
  files?: Express.Multer.File[];
}

const prisma = new PrismaClient();

// Helper function to handle file upload to Cloudinary
const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "patent_images",
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    // Create a readable stream from the file buffer
    const stream = Readable.from(file.buffer);
    stream.pipe(uploadStream);
  });
};

export const createPatent = async (req: FileRequest, res: Response) => {
  try {
    const { title, description, professorId } = req.body;
    const baseUrl = FRONTEND_URL || "http://localhost:3000";

    // Check if professor exists and is approved
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: { isApproved: true },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    if (!professor.isApproved) {
      return res.status(403).json({
        error: "You are not approved to create patents yet",
      });
    }

    // Basic validation
    if (!title || !description || !professorId) {
      return res.status(400).json({
        error: "Title, description, and professorId are required fields",
      });
    }

    // Validate files
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        error: "At least one image is required",
      });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        error: "Maximum 4 images allowed",
      });
    }

    // Upload images to Cloudinary concurrently
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file));

    // Wait for all uploads to complete
    const imageUrls = await Promise.all(uploadPromises);

    console.log("Uploaded image URLs:", imageUrls); // Debug log

    // Create patent with all image URLs
    const patent = await prisma.patent.create({
      data: {
        title,
        description,
        imageUrl: imageUrls, // This will now be an array of URLs
        professor: {
          connect: { id: professorId },
        },
      },
      include: {
        professor: true,
      },
    });

    // Send notifications to businesses
    const businesses = await prisma.business.findMany();
    const profileUrl = `${baseUrl}/professor-profile/${professorId}`;
    await Promise.all(
      businesses.map((business) =>
        createNotification(
          NotificationType.PATENT_APPLICATION,
          `Professor <a href="${profileUrl}">${patent.professor.fullName}</a> has created a new patent titled "${patent.title}"`,
          business.id,
          "business",
          patent.id,
          "patent"
        )
      )
    );

    res.status(201).json(patent);
  } catch (error) {
    console.error("Error in createPatent:", error);
    res.status(500).json({
      error: "Failed to create patent",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Get patents by professor ID
export const getPatentsByProfessorId = async (req: Request, res: Response) => {
  const { professorId } = req.params;
  try {
    const patents = await prisma.patent.findMany({
      where: { professorId },
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            university: true,
          },
        },
      },
    });
    res.status(200).json(patents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professor's patents" });
  }
};

export const getAllPatents = async (req: Request, res: Response) => {
  try {
    const patents = await prisma.patent.findMany({
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            degree: true,
            position: true,
          },
        },
      },
    });
    res.status(200).json(patents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patents" });
  }
};
