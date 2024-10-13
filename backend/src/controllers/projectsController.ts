import { PrismaClient, ProjectType, Status } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

// Create project by business
export const createBusinessProject = async (req: Request, res: Response) => {
  try {
    const { topic, content, difficulty, timeline, tags, businessId } = req.body;

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        difficulty,
        timeline: new Date(timeline),
        tags,
        status: Status.OPEN,
        type: ProjectType.BUSINESS,
        business: { connect: { id: businessId } },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Create project by professor
export const createProfessorProject = async (req: Request, res: Response) => {
  try {
    const { topic, content, difficulty, timeline, tags, professorId } =
      req.body;

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        difficulty,
        timeline: new Date(timeline),
        tags,
        status: Status.OPEN,
        type: ProjectType.PROFESSOR,
        professor: { connect: { id: professorId } },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

// Get all business projects
export const getAllBusinessProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { type: ProjectType.BUSINESS },
      include: {
        business: true,
        professor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch business projects" });
  }
};

// Get all professor projects
export const getAllProfessorProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { type: ProjectType.PROFESSOR },
      include: { professor: true },
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professor projects" });
  }
};

export const changeBusinessProjectStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, selectedProfessorId } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id, type: ProjectType.BUSINESS },
      data: {
        status,
        ...(status === Status.ONGOING || status === Status.CLOSED
          ? { professorId: selectedProfessorId }
          : {}),
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project status" });
  }
};

// Change status of a professor project
export const changeProfessorProjectStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, selectedStudentId } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id, type: ProjectType.PROFESSOR },
      data: {
        status,
        ...(status === Status.ONGOING || status === Status.CLOSED
          ? { studentId: selectedStudentId }
          : {}),
      },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project status" });
  }
};

// Get all projects by business ID
export const getProjectsByBusinessId = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const projects = await prisma.project.findMany({
      where: {
        businessId,
        type: ProjectType.BUSINESS,
      },
      include: { business: true, professor: true },
    });

    // if (!projects.length) {
    //   return res.json({ error: "No projects found for this business" });
    // }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Get all projects by professor ID
export const getProjectsByProfessorId = async (req: Request, res: Response) => {
  try {
    const { professorId } = req.params;

    const projects = await prisma.project.findMany({
      where: {
        professorId,
        type: ProjectType.PROFESSOR,
      },
      include: { professor: true, student: true },
    });

    if (!projects.length) {
      return res
        .status(404)
        .json({ error: "No projects found for this professor" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Apply to a business project (for professors)
export const applyToBusinessProject = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      professorId,
      professorName,
      professorEmail,
      professorPhoneNumber,
    } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId, type: ProjectType.BUSINESS },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const appliedProfessor = await prisma.appliedProfessor.create({
      data: {
        project: { connect: { id: projectId } },
        professorId,
        name: professorName,
        email: professorEmail,
        phoneNumber: professorPhoneNumber,
      },
    });

    res.status(200).json(appliedProfessor);
  } catch (error) {
    res.status(500).json({ error: "Failed to apply to project" });
  }
};

// Apply to a professor project (for students)
export const applyToProfessorProject = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      studentId,
      studentName,
      studentEmail,
      studentPhoneNumber,
    } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId, type: ProjectType.PROFESSOR },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const appliedStudent = await prisma.appliedStudent.create({
      data: {
        project: { connect: { id: projectId } },
        studentId,
        name: studentName,
        email: studentEmail,
        phoneNumber: studentPhoneNumber,
      },
    });

    res.status(200).json(appliedStudent);
  } catch (error) {
    res.status(500).json({ error: "Failed to apply to project" });
  }
};

// Get applied professors for a business project
export const getAppliedProfessors = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const appliedProfessors = await prisma.appliedProfessor.findMany({
      where: { projectId },
      select: {
        professorId: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    res.status(200).json(appliedProfessors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applied professors" });
  }
};

// Get applied students for a professor project
export const getAppliedStudents = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const appliedStudents = await prisma.appliedStudent.findMany({
      where: { projectId },
      select: {
        studentId: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    res.status(200).json(appliedStudents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applied students" });
  }
};
