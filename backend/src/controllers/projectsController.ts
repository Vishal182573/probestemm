// src/controllers/projectControllers.ts
import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const ProjectSchema = z.object({
  topic: z.string().min(1),
  content: z.string().min(1),
  difficulty: z.enum(["EASY", "INTERMEDIATE", "HARD"]),
  timeline: z.string().transform((str) => new Date(str)),
  tags: z.array(z.string()),
  status: z.enum(["OPEN", "ONGOING", "CLOSED"]),
});

// Create project for professor
const createProfessorProject = async (req: Request, res: Response) => {
  try {
    const { professorId } = req.params;
    const validatedData = ProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        professor: {
          connect: { id: professorId },
        },
        // Explicitly set businessId to null
        business: undefined,
        businessId: undefined,
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res
      .status(500)
      .json({ error: "Failed to create professor project" });
  }
};

// Create project for business
const createBusinessProject = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const validatedData = ProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        business: {
          connect: { id: businessId },
        },
        // Explicitly set professorId to null
        professor: undefined,
        professorId: undefined,
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to create business project" });
  }
};

// Get all professor projects
const getAllProfessorProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        NOT: {
          professorId: null,
        },
      },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
          },
        },
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch professor projects" });
  }
};

// Get all business projects
const getAllBusinessProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        NOT: {
          businessId: null,
        },
      },
      include: {
        business: {
          select: {
            id: true,
            companyName: true,
            email: true,
            website: true,
          },
        },
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch business projects" });
  }
};

// Get projects by specific professor
const getProfessorProjects = async (req: Request, res: Response) => {
  try {
    const { professorId } = req.params;
    const projects = await prisma.project.findMany({
      where: {
        professorId,
      },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
          },
        },
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to fetch professor projects" });
  }
};

// Get projects by specific business
const getBusinessProjects = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const projects = await prisma.project.findMany({
      where: {
        businessId,
      },
      include: {
        business: {
          select: {
            id: true,
            companyName: true,
            email: true,
            website: true,
          },
        },
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch business projects" });
  }
};

// Get single project with creator details
const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
          },
        },
        business: {
          select: {
            id: true,
            companyName: true,
            email: true,
            website: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Add a field to indicate the creator type
    const projectWithCreatorType = {
      ...project,
      creatorType: project.professorId ? "PROFESSOR" : "BUSINESS",
    };

    return res.status(200).json(projectWithCreatorType);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch project" });
  }
};

// export const updateProject = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const validatedData = ProjectSchema.partial().parse(req.body);

//     const project = await prisma.project.update({
//       where: { id },
//       data: validatedData,
//       include: {
//         professor: {
//           select: {
//             id: true,
//             name: true,
//             title: true,
//           }
//         }
//       }
//     });

//     return res.status(200).json(project);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update project' });
//   }
// };

// export const deleteProject = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     await prisma.project.delete({
//       where: { id },
//     });
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to delete project' });
//   }
// };

export {
  getProjectById,
  createBusinessProject,
  createProfessorProject,
  getAllBusinessProjects,
  getAllProfessorProjects,
  getBusinessProjects,
  getProfessorProjects,
};
