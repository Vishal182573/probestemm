import type{ Request, Response } from "express";
import { PrismaClient, WebinarStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Get all webinars
export const getAllWebinars = async (req: Request, res: Response) => {
  try {
    const webinars = await prisma.webinar.findMany();
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

export const requestWebinar = async (req: Request, res: Response) => {
  const { professorId, title, topic, place, date, maxAttendees, duration, isOnline, meetingLink } = req.body;

  try {
    // Check if there's already a pending webinar request for this professor
    const existingWebinar = await prisma.webinar.findFirst({
      where: {
        professorId,
        status: WebinarStatus.PENDING,
      },
    });

    if (existingWebinar) {
      return res.status(400).json({ 
        error: "A webinar request with 'PENDING' status already exists." 
      });
    }

    // Create a new webinar request
    const newWebinar = await prisma.webinar.create({
      data: {
        title,
        topic,
        place,
        date: new Date(date),
        maxAttendees,
        duration,
        isOnline,
        meetingLink,
        status: WebinarStatus.PENDING,
        professorId,
      },
    });

    res.status(201).json(newWebinar);
  } catch (error) {
    res.status(500).json({ error: "Failed to request webinar" });
  }
};


// SuperAdmin updates webinar status (APPROVED / REJECTED)
export const updateWebinarStatus = async (req: Request, res: Response) => {
  const { webinarId } = req.params;
  const { status } = req.body; // Status should be either APPROVED or REJECTED

  if (![WebinarStatus.APPROVED, WebinarStatus.REJECTED].includes(status)) {
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

// Professor updates webinar status to COMPLETED / CANCELLED
export const updateProfessorWebinarStatus = async (req: Request, res: Response) => {
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
