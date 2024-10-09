import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import express from 'express';

const prisma = new PrismaClient();

// Validation schemas
const ProfessorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  title: z.string().min(1),
  university: z.string().min(1),
  photoUrl: z.string().optional(),
  website: z.string().url().optional(),
  degree: z.string().min(1),
});

// GET /api/professors
export const getProfessors = async (req: Request, res: Response) => {
  try {
    const professors = await prisma.professor.findMany({
      include: {
        positions: true,
        achievements: true,
        blogs: true,
        projects: true,
        webinars: true,
      },
    });
    return res.status(200).json(professors);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch professors' });
  }
};

// GET /api/professors/:id
export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        positions: true,
        achievements: true,
        blogs: true,
        projects: true,
        webinars: true,
      },
    });

    if (!professor) {
      return res.status(404).json({ error: 'Professor not found' });
    }

    return res.status(200).json(professor);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch professor' });
  }
};

// POST /api/professors
export const createProfessor = async (req: Request, res: Response) => {
  try {
    const validatedData = ProfessorSchema.parse(req.body);
    const professor = await prisma.professor.create({
      data: validatedData,
    });
    return res.status(201).json(professor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create professor' });
  }
};

// PUT /api/professors/:id
// export const updateProfessor = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const validatedData = ProfessorSchema.partial().parse(req.body);
    
//     const professor = await prisma.professor.update({
//       where: { id },
//       data: validatedData,
//     });
    
//     return res.status(200).json(professor);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update professor' });
//   }
// };