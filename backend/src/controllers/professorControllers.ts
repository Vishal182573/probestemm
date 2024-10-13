import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema
const ProfessorUpdateSchema = z.object({
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().optional(),
  title: z.string().optional(),
  university: z.string().optional(),
  website: z.string().optional(),
  degree: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  researchInterests: z.string().optional(),
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "student" | "professor" | "business" | "admin";
  };
}

const getProfessors = async (req: Request, res: Response) => {
  try {
    const professors = await prisma.professor.findMany({
      select: {
        id: true,
        fullName: true,
        title: true,
        university: true,
        department: true,
      },
    });
    return res.status(200).json(professors);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch professors" });
  }
};

const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        positions: true,
        achievements: true,
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            comments: true,
            likes: true,
            dislikes: true,
            createdAt: true,
          },
        },
        projects: {
          where: { type: "PROFESSOR" },
          select: {
            id: true,
            topic: true,
            content: true,
            status: true,
          },
        },
        webinars: {
          select: {
            id: true,
            title: true,
            date: true,
            status: true,
          },
        },
      },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    return res.status(200).json(professor);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch professor" });
  }
};

const updateProfessor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = ProfessorUpdateSchema.parse(req.body);
    const professorId = req.user?.id;

    if (!professorId || professorId !== id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
    }

    const updatedProfessor = await prisma.professor.update({
      where: { id },
      data: validatedData,
    });

    return res.status(200).json(updatedProfessor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update professor" });
  }
};

export default {
  getProfessors,
  getProfessorById,
  updateProfessor,
};
