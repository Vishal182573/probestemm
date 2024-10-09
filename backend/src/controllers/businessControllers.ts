// src/controllers/businessControllers.ts
import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const BusinessSchema = z.object({
  email: z.string().email(),
  companyName: z.string().min(1),
  description: z.string().min(1),
  website: z.string().url(),
});

const BusinessProjectSchema = z.object({
  topic: z.string().min(1),
  content: z.string().min(1),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']),
  timeline: z.string().transform((str) => new Date(str)),
  tags: z.array(z.string()),
  status: z.enum(['OPEN', 'ONGOING', 'CLOSED']),
});

const BusinessAnswerSchema = z.object({
  content: z.string().min(1),
});

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const validatedData = BusinessSchema.parse(req.body);
    const business = await prisma.business.create({
      data: validatedData,
    });
    return res.status(201).json(business);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create business' });
  }
};

export const getBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        projects: true,
        answers: {
          include: {
            discussion: true,
          },
        },
      },
    });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    return res.status(200).json(business);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch business' });
  }
};

// Project management
export const createProject = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const validatedData = BusinessProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        business: {
          connect: { id: businessId },
        },
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create project' });
  }
};

// Discussion participation
export const answerDiscussion = async (req: Request, res: Response) => {
  try {
    const { businessId, discussionId } = req.params;
    const validatedData = BusinessAnswerSchema.parse(req.body);

    const answer = await prisma.answer.create({
      data: {
        ...validatedData,
        business: {
          connect: { id: businessId },
        },
        discussion: {
          connect: { id: discussionId },
        },
      },
    });

    // Update discussion status
    await prisma.discussion.update({
      where: { id: discussionId },
      data: { status: 'ANSWERED' },
    });

    return res.status(201).json(answer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create answer' });
  }
};

// Get business projects
export const getBusinessProjects = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const projects = await prisma.project.findMany({
      where: { businessId },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
