import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const StudentFilterSchema = z.object({
  fullName: z.string().optional(),
  university: z.string().optional(),
  course: z.string().optional(),
  location: z.string().optional(),
}).optional();

// GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const filters = StudentFilterSchema.parse(req.query);
    
    const where: any = {};

    if (filters?.fullName) {
      where.fullName = {
        contains: filters.fullName,
        mode: 'insensitive'
      };
    }

    if (filters?.university) {
      where.university = {
        contains: filters.university,
        mode: 'insensitive'
      };
    }

    if (filters?.course) {
      where.course = {
        contains: filters.course,
        mode: 'insensitive'
      };
    }

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive'
      };
    }

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        university: true,
        course: true,
        location: true,
        imageUrl: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return res.status(200).json(students);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to fetch students" });
  }
};
// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        researchHighlights: true,
        education: true,
        achievements: true,
        discussions: true,
        comments: true,
        projects: true,
      },
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      location,
      imageUrl,
      university,
      course,
      experience,
    } = req.body;

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        password,
        phoneNumber,
        location,
        imageUrl,
        university,
        course,
        experience,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      phoneNumber,
      location,
      imageUrl,
      university,
      course,
      experience,
    } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        email,
        password,
        phoneNumber,
        location,
        imageUrl,
        university,
        course,
        experience,
      },
    });
    res.status(200).json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};
