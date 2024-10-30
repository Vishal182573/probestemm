import type { Request, Response } from "express";

import cloudinary from "../config/cloudinary";

import { NotificationType, PrismaClient } from "@prisma/client";
import { createNotification } from "./notificationController";

interface FileRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const prisma = new PrismaClient();

// createPatent

export const createPatent = async (req: FileRequest, res: Response) => {
  try {
    const { title, description, professorId } = req.body;
    const professor = await prisma.professor.findUnique({
      where: {
        id: professorId,
      },
      select: {
        isApproved: true,
      },
    });
    console.log("Professor data:", professor);
    if (!professor) {
      return res.status(404).json({
        error: "Professor not found",
      });
    }

    if (!professor.isApproved) {
      return res.status(403).json({
        error: "You are not approved to create webinars yet",
      });
    }
    const files = req.files as unknown as Express.Multer.File[];

    console.log("Processing files:", files);

    // Basic validation
    if (!title || !description || !professorId) {
      return res.status(400).json({
        error: "Title, description, and professorId are required fields",
      });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: "At least one image is required",
      });
    }

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const buffer = file.buffer;

      if (!buffer) {
        throw new Error("File buffer is missing.");
      }

      const b64 = buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "patent_images",
          transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        });
        return result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image");
      }
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Create patent
    const patent = await prisma.patent.create({
      data: {
        title,
        description,
        imageUrl: imageUrls,
        professor: {
          connect: {
            id: professorId,
          },
        },
      },
      include: {
        professor: true,
      },
    });

    // Send notifications to businesses
    const businesses = await prisma.business.findMany();
    await Promise.all(
      businesses.map((business) =>
        createNotification(
          NotificationType.PATENT_APPLICATION,
          `Professor ${patent.professor.fullName} has created a new patent titled "${patent.title}"`,
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
