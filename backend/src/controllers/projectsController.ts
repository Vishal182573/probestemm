// controllers/projectController.ts

import type { Request, Response } from "express";
import {
  PrismaClient,
  ProjectType,
  ProposalCategory,
  Status,
} from "@prisma/client";
import { createNotification } from "./notificationController";

const prisma = new PrismaClient();

// Create professor collaboration project
export const createProfessorProject = async (req: Request, res: Response) => {
  try {
    const { professorId, topic, content, timeline, tags } = req.body;

    // Get professor details for notification
    const creatingProfessor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        university: true,
        department: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.PROFESSOR_PROJECT,
        category: ProposalCategory.PROFESSOR_COLLABORATION,
        status: Status.OPEN,
        timeline: timeline ? new Date(timeline) : null,
        tags,
        professorId,
      },
    });

    // Enhanced notification message
    const notificationContent = `
      New Collaboration Opportunity!
      Project: ${topic}
      Professor: ${creatingProfessor?.fullName}
      University: ${creatingProfessor?.university}
      Department: ${creatingProfessor?.department}
      Contact: ${creatingProfessor?.email} ${
      creatingProfessor?.phoneNumber ? `/ ${creatingProfessor.phoneNumber}` : ""
    }
    `.trim();

    // Notify all professors
    const allProfessors = await prisma.professor.findMany({
      where: {
        id: { not: professorId },
        isApproved: true,
      },
    });

    for (const professor of allProfessors) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        professor.id,
        "professor",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating professor project:", error);
    res.status(500).json({ error: "Failed to create professor project" });
  }
};

// Create student opportunity project
export const createStudentProject = async (req: Request, res: Response) => {
  try {
    const {
      professorId,
      topic,
      content,
      category,
      timeline,
      tags,
      eligibility,
      duration,
      isFunded,
      fundDetails,
      desirable,
    } = req.body;

    // Get professor details for notification
    const creatingProfessor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        university: true,
        department: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.PROFESSOR_PROJECT,
        category,
        status: Status.OPEN,
        timeline: timeline ? new Date(timeline) : null,
        tags,
        professorId,
        eligibility,
        isFunded,
        fundDetails,
        desirable,
        duration: duration
          ? {
              create: {
                startDate: new Date(duration.startDate),
                endDate: new Date(duration.endDate),
              },
            }
          : undefined,
      },
      include: {
        duration: true,
      },
    });

    // Enhanced notification message
    const notificationContent = `
      New ${category.toLowerCase().replace("_", " ")} Opportunity!
      Project: ${topic}
      Professor: ${creatingProfessor?.fullName}
      University: ${creatingProfessor?.university}
      Department: ${creatingProfessor?.department}
      Duration: ${
        project.duration
          ? `${new Date(
              project.duration.startDate
            ).toLocaleDateString()} to ${new Date(
              project.duration.endDate
            ).toLocaleDateString()}`
          : "Not specified"
      }
      Funding: ${isFunded ? "Yes" : "No"}
      Contact: ${creatingProfessor?.email} ${
      creatingProfessor?.phoneNumber ? `/ ${creatingProfessor.phoneNumber}` : ""
    }
    `.trim();

    // Notify all students
    const allStudents = await prisma.student.findMany();
    for (const student of allStudents) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        student.id,
        "student",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating student project:", error);
    res.status(500).json({ error: "Failed to create student project" });
  }
};

// Create industry collaboration project
export const createIndustryProject = async (req: Request, res: Response) => {
  try {
    const {
      professorId,
      topic,
      content,
      timeline,
      tags,
      techDescription,
      requirements,
    } = req.body;

    // Get professor details for notification
    const creatingProfessor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        university: true,
        department: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.PROFESSOR_PROJECT,
        category: ProposalCategory.INDUSTRY_COLLABORATION,
        status: Status.OPEN,
        timeline: timeline ? new Date(timeline) : null,
        tags,
        professorId,
        techDescription,
        requirements,
      },
    });

    // Enhanced notification message
    const notificationContent = `
      New Industry Collaboration Opportunity!
      Project: ${topic}
      Professor: ${creatingProfessor?.fullName}
      University: ${creatingProfessor?.university}
      Department: ${creatingProfessor?.department}
      Technology Focus: ${techDescription}
      Contact: ${creatingProfessor?.email} ${
      creatingProfessor?.phoneNumber ? `/ ${creatingProfessor.phoneNumber}` : ""
    }
    `.trim();

    // Notify all businesses
    const allBusinesses = await prisma.business.findMany();
    for (const business of allBusinesses) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        business.id,
        "business",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating industry project:", error);
    res.status(500).json({ error: "Failed to create industry project" });
  }
};

// Get projects by type
export const getProjectsByType = async (req: Request, res: Response) => {
  try {
    const { type, category } = req.query;

    const projects = await prisma.project.findMany({
      where: {
        type: type as ProjectType,
        category: category as ProposalCategory,
        status: Status.OPEN,
      },
      include: {
        professor: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
            university: true,
            department: true,
          },
        },
        duration: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Apply for a project
export const applyForProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const {
      applicantId,
      applicantType,
      name,
      email,
      phoneNumber,
      description,
    } = req.body;
    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    let application;
    let applicantDetails;

    switch (applicantType) {
      case "professor":
        applicantDetails = await prisma.professor.findUnique({
          where: { id: applicantId },
          select: {
            fullName: true,
            university: true,
            department: true,
          },
        });
        application = await prisma.professorApplication.create({
          data: {
            projectId,
            professorId: applicantId,
            name,
            email,
            phoneNumber,
            description,
            images,
          },
        });
        break;
      case "student":
        applicantDetails = await prisma.student.findUnique({
          where: { id: applicantId },
          select: {
            fullName: true,
            university: true,
            course: true,
          },
        });
        application = await prisma.studentApplication.create({
          data: {
            projectId,
            studentId: applicantId,
            name,
            email,
            phoneNumber,
            description,
            images,
          },
        });
        break;
      case "business":
        applicantDetails = await prisma.business.findUnique({
          where: { id: applicantId },
          select: {
            companyName: true,
            industry: true,
          },
        });
        application = await prisma.businessApplication.create({
          data: {
            projectId,
            businessId: applicantId,
            name,
            email,
            phoneNumber,
            description,
            images,
          },
        });
        break;
    }

    // NOTIFICATIONS
    const notificationContent = `
      New Application Received!
      Project: ${project.topic}
      Applicant: ${
        applicantType === "business"
          ? (
              applicantDetails as {
                companyName: string;
                industry: string | null;
              }
            )?.companyName
          : (applicantDetails as { fullName: string })?.fullName
      }
      ${
        applicantType === "professor"
          ? `University: ${applicantDetails?.university}
      Department: ${applicantDetails?.department}`
          : applicantType === "student"
          ? `University: ${applicantDetails?.university}
      Course: ${applicantDetails?.course}`
          : `Industry: ${applicantDetails?.industry}`
      }
      Contact: ${email} ${phoneNumber ? `/ ${phoneNumber}` : ""}
      Message: ${description}
    `.trim();

    if (project.professorId) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        project.professorId,
        "professor",
        projectId,
        "project"
      );
    }

    res.status(201).json(application);
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

// GET ROUTE FOR PROJECT APPLICATIONS DEPENDING ON TYPE
export const getProjectApplications = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const applications = await prisma.$transaction([
      prisma.professorApplication.findMany({
        where: { projectId },
        include: { project: true },
      }),
      prisma.studentApplication.findMany({
        where: { projectId },
        include: { project: true },
      }),
      prisma.businessApplication.findMany({
        where: { projectId },
        include: { project: true },
      }),
    ]);

    res.status(200).json({
      professorApplications: applications[0],
      studentApplications: applications[1],
      businessApplications: applications[2],
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
