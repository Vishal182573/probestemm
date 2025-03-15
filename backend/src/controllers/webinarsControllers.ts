import type { Request, Response } from "express";
import { NotificationType, PrismaClient, WebinarStatus } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import { createNotification } from "./notificationController";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
interface FileRequest extends Request {
  files?: Express.Multer.File[];
}

const prisma = new PrismaClient();

export const getAllWebinars = async (req: Request, res: Response) => {
  try {
    const webinars = await prisma.webinar.findMany({
      where: {
        status: {
          in: ["APPROVED", "COMPLETED"],
        },
      },
      orderBy: {
        createdAt: 'desc'  // Assumes there's a createdAt field, most common for sorting
        // Alternative: use updatedAt or startDate if those are more appropriate
      },
    });
    
    res.status(200).json(webinars);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch webinars" });
  }
};

// Get webinars by professor ID
export const getWebinarsByProfessorId = async (req: Request, res: Response) => {
  const { professorId } = req.params;
  try {
    const webinars = await prisma.webinar.findMany({
      where: { professorId },
    });
    res.status(200).json(webinars);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professor's webinars" });
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadDocumentToS3 = async (
  file: Express.Multer.File
): Promise<string> => {
  const fileExtension = file.originalname.split(".").pop();
  const key = `webinar-documents/${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: ObjectCannedACL.private,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN_NAME;
    return `https://${cloudFrontDomain}/${key}`;
  } catch (error) {
    console.error("Error uploading document to S3:", error);
    throw new Error("Error uploading document to S3");
  }
};

export const requestWebinar = async (req: Request, res: Response) => {
  try {
    const {
      professorId,
      title,
      topic,
      place,
      date,
      maxAttendees,
      duration,
      isOnline,
      meetingLink,
      address,
    } = req.body;

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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let webinarImage = "";
    let webinarDocument = "";

    // Handle image upload to Cloudinary
    if (files["webinarImage"]) {
      try {
        const b64 = Buffer.from(files["webinarImage"][0].buffer).toString(
          "base64"
        );
        const dataURI =
          "data:" + files["webinarImage"][0].mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI);
        webinarImage = result.secure_url;
        console.log("Image uploaded to Cloudinary:", webinarImage);
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    // Handle document upload to S3
    if (files["webinarDocument"]) {
      try {
        webinarDocument = await uploadDocumentToS3(files["webinarDocument"][0]);
        console.log("Document uploaded to S3:", webinarDocument);
      } catch (uploadError) {
        console.error("Error uploading to S3:", uploadError);
        return res.status(500).json({ error: "Failed to upload document" });
      }
    }

    // Create a new webinar request
    const newWebinar = await prisma.webinar.create({
      data: {
        title,
        topic,
        place,
        date: new Date(date),
        maxAttendees: parseInt(maxAttendees),
        duration: parseInt(duration),
        isOnline: isOnline === "true",
        meetingLink,
        address,
        status: WebinarStatus.PENDING,
        professorId,
        webinarImage,
        webinarDocument, // Add the document URL
      },
    });

    console.log("New webinar created:", newWebinar);
    res.status(201).json(newWebinar);
  } catch (error) {
    console.error("Error in requestWebinar:", error);
    res.status(500).json({
      error: "Failed to request webinar",
      details: (error as any).message,
    });
  }
};
// SuperAdmin updates webinar status (APPROVED / REJECTED)
export const updateWebinarStatus = async (req: Request, res: Response) => {
  const { webinarId } = req.params;
  const { status } = req.body;

  // Status should be either APPROVED or REJECTED
  if (![WebinarStatus.APPROVED, WebinarStatus.REJECTED].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedWebinar = await prisma.webinar.update({
      where: { id: webinarId },
      data: { status },
    });

    await createNotification(
      NotificationType.WEBINAR_STATUS,
      `Your webinar "${
        updatedWebinar.title
      }" has been ${status.toLowerCase()}.`,
      updatedWebinar.professorId,
      "professor",
      webinarId,
      "webinar"
    );

    res.status(200).json(updatedWebinar);
  } catch (error) {
    res.status(500).json({ error: "Failed to update webinar status" });
  }
};

// Professor updates webinar status to COMPLETED / CANCELLED
export const updateProfessorWebinarStatus = async (
  req: Request,
  res: Response
) => {
  const { webinarId } = req.params;
  const { status } = req.body; // Status should be either COMPLETED or CANCELLED

  if (![WebinarStatus.COMPLETED, WebinarStatus.CANCELLED].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedWebinar = await prisma.webinar.update({
      where: { id: webinarId },
      data: { status },
    });
    res.status(200).json(updatedWebinar);
  } catch (error) {
    res.status(500).json({ error: "Failed to update webinar status" });
  }
};
