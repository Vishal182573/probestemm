import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const SearchQuerySchema = z.object({
  query: z.string().optional(),
  field: z.enum(['fullName', 'university', 'course', 'location']).optional(),
});


export const searchStudents = async (req: Request, res: Response) => {
  try {
    const { query, field } = SearchQuerySchema.parse(req.query);
    
    let whereClause: any = {};

    // If no query is provided, return all students
    if (!query) {
      const allStudents = await prisma.student.findMany({
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
      return res.status(200).json(allStudents);
    }

    // If a specific field is provided, search only that field
    if (field) {
      whereClause = {
        [field]: {
          contains: query,
          mode: 'insensitive'
        }
      };
    } else {
      // If no specific field is provided, search across all specified fields
      whereClause = {
        OR: [
          {
            fullName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            university: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            course: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            location: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      };
    }

    const students = await prisma.student.findMany({
      where: whereClause,
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
    console.error("Error searching students:", error);
    return res.status(500).json({ error: "Failed to search students" });
  }
};
// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        // researchHighlights: true,
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
