import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const StudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  imageUrl: z.string().optional(),
});

// GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        discussions: true,
        education: true,
        researchHighlights: true,
        experiences: true,
        achievements: true,
      },
    });
    res.status(200).json(students);  // Don't return the response directly
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await prisma.student.findUnique({
      where: { id: String(id) },  // Ensure id is cast to string or appropriate type
      include: {
        discussions: true,
        education: true,
        researchHighlights: true,
        experiences: true,
        achievements: true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const validatedData = StudentSchema.parse(req.body);
    const student = await prisma.student.create({
      data: validatedData,
    });
    res.status(201).json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = StudentSchema.partial().parse(req.body);
    
    const student = await prisma.student.update({
      where: { id: String(id) },  // Ensure id is cast to string
      data: validatedData,
    });
    
    res.status(200).json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update student' });
  }
};
