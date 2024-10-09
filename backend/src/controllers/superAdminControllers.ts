import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const SuperAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// User Management
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    const professors = await prisma.professor.findMany();
    const businesses = await prisma.business.findMany();
    
    return res.status(200).json({
      students,
      professors,
      businesses,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Content Management
export const getWebinars = async (req: Request, res: Response) => {
  try {
    const webinars = await prisma.webinar.findMany();
    return res.status(200).json({webinars});
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
};

// Specific management functions
export const manageWebinar = async (req: Request, res: Response) => {
  try {
    const { webinarId } = req.params;
    const { status } = req.body;
    
    const webinar = await prisma.webinar.update({
      where: { id: webinarId },
      data: { status },
    });
    
    return res.status(200).json(webinar);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update webinar status' });
  }
};