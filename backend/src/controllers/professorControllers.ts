import type { Request, Response } from "express";
import { PrismaClient, NotificationType, ProjectType } from "@prisma/client";
import { z } from "zod";
import { createNotification } from "./notificationController";

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
  isapproved: z.boolean().optional(),
});

const ProfessorFilterSchema = z
  .object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    department: z.string().optional(),
    university: z.string().optional(),
    location: z.string().optional(),
  })
  .optional();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "student" | "professor" | "business" | "admin";
  };
}
export const getProfessors = async (req: Request, res: Response) => {
  try {
    const filters = ProfessorFilterSchema.parse(req.query);

    const where: any = {
      isApproved: true,
    };

    if (filters?.fullName) {
      where.fullName = {
        contains: filters.fullName,
        mode: "insensitive",
      };
    }

    if (filters?.title) {
      where.title = {
        contains: filters.title,
        mode: "insensitive",
      };
    }

    if (filters?.department) {
      where.department = {
        contains: filters.department,
        mode: "insensitive",
      };
    }

    if (filters?.university) {
      where.university = {
        contains: filters.university,
        mode: "insensitive",
      };
    }

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: "insensitive",
      };
    }

    const professors = await prisma.professor.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        title: true,
        department: true,
        university: true,
        location: true,
        photoUrl: true,
        email: true,
        website: true,
        degree: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(professors);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to fetch professors" });
  }
};

export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        // isapproved: true,
        positions: true,
        achievements: true,
        researchInterests: true,
        tags: true,
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
          where: { type: ProjectType.PROFESSOR_PROJECT },
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

export const updateProfessorApprovalStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { professorId } = req.params;

    if (!professorId) {
      return res.status(400).json({ error: "Professor ID is required" });
    }

    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    // Update professor approval status
    const updatedProfessor = await prisma.professor.update({
      where: { id: professorId },
      data: { isApproved: true },
    });

    await createNotification(
      NotificationType.PROFESSOR_APPROVAL,
      "Your professor account has been approved. You can now access all platform features.",
      professorId,
      "professor",
      "professor-approval"
    );

    return res.status(200).json({
      success: true,
      data: updatedProfessor,
    });
  } catch (error) {
    console.error("Professor approval error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update professor status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export default {
  getProfessors,
  getProfessorById,
  updateProfessor,
  updateProfessorApprovalStatus,
};
