// controllers/projectController.ts

import type { Request, Response } from "express";
import {
  PrismaClient,
  ProjectType,
  ProposalCategory,
  Status,
  NotificationType,
} from "@prisma/client";
import { createNotification } from "./notificationController";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

function uploadToCloudinary(fileBuffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "project-applications" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        return resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}
// Create professor collaboration project
export const createProfessorProject = async (req: Request, res: Response) => {
  try {
    const { cat, subcategory, professorId, topic, content, timeline, tags } = req.body;

    // First verify the creating professor exists
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

    if (!creatingProfessor) {
      return res.status(404).json({ error: "Creating professor not found" });
    }

    // Create the project
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
      Professor ${creatingProfessor.fullName} from ${creatingProfessor.university} 
    `.trim();

    // Fetch and notify matching professors
    const matchingProfessors = await prisma.professorTag.findMany({
      where: {
        AND: [{ category: cat }, { subcategory: subcategory },{ professorId: { not: professorId } }],
      },
      include: {
        professor: true,
      },
    });

    // Create notifications in parallel
    await Promise.all(
      matchingProfessors.map((professorTag) =>
        createNotification(
          "PROJECT_APPLICATION",
          notificationContent,
          professorTag.professorId,
          "professor",
          "/projects/professor",
          project.id,
          "project"
        ).catch((error) => {
          console.error(
            `Failed to create notification for professor ${professorTag.professorId}:`,
            error
          );
        })
      )
    );

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
    `.trim();

    // Notify all students
    const allStudents = await prisma.student.findMany();
    for (const student of allStudents) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        student.id,
        "student",
        "/projects/professor",
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
    `.trim();

    // Notify all businesses
    const allBusinesses = await prisma.business.findMany();
    for (const business of allBusinesses) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        business.id,
        "business",
        "/projects/professor",
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
             category: category as ProposalCategory
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
         orderBy: {
             createdAt: 'desc' // This will return the collections in reverse order
         }
     });
     res.status(200).json(projects);
  } catch (error) {
     console.error("Error fetching projects:", error);
     res.status(500).json({ error: "Failed to fetch projects" });
  }
 };

 export const getProjectsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId, userType } = req.params;
    
    if (!["professor", "student", "business"].includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    // Base query object with common includes
    const baseQueryObject = {
      include: {
        professorApplications: {
          select: {
            id: true,
            professorId: true,
            name: true,
            email: true,
            phoneNumber: true,
            description: true,
            images: true,
          },
        },
        studentApplications: {
          select: {
            id: true,
            studentId: true,
            name: true,
            email: true,
            phoneNumber: true,
            description: true,
            images: true,
          },
        },
        businessApplications: {
          select: {
            id: true,
            businessId: true,
            name: true,
            email: true,
            phoneNumber: true,
            description: true,
            images: true,
          },
        },
      },
    };

    // Set where clause based on user type
    const whereClause = {
      [userType + 'Id']: userId,
    };

    // Fetch projects with all applications
    const projects = await prisma.project.findMany({
      where: whereClause,
      ...baseQueryObject,
    });

    // Process projects to include selected applicant info with type
    const processedProjects = projects.map(project => {
      let selectedApplicant = null;
      let applicantType = null;
      let applicantCollection = null;
      
      if (project.selectedApplicationId) {
        // Check each application type for the selected applicant
        const professorApplicant = project.professorApplications.find(
          app => app.id === project.selectedApplicationId
        );
        const studentApplicant = project.studentApplications.find(
          app => app.id === project.selectedApplicationId
        );
        const businessApplicant = project.businessApplications.find(
          app => app.id === project.selectedApplicationId
        );

        if (professorApplicant) {
          selectedApplicant = professorApplicant;
          applicantType = 'professor';
          applicantCollection = 'professorApplications';
        } else if (studentApplicant) {
          selectedApplicant = studentApplicant;
          applicantType = 'student';
          applicantCollection = 'studentApplications';
        } else if (businessApplicant) {
          selectedApplicant = businessApplicant;
          applicantType = 'business';
          applicantCollection = 'businessApplications';
        }
      }

      // Create a clean project object without the application arrays
      const { 
        professorApplications, 
        studentApplications, 
        businessApplications, 
        ...projectWithoutApplications 
      } = project;

      // Return project with enhanced selected applicant info
      return {
        ...projectWithoutApplications,
        selectedApplicant: selectedApplicant ? {
          id: selectedApplicant.id,
          type: applicantType,
          collection: applicantCollection,
          userId: selectedApplicant[`${applicantType}Id`],
          name: selectedApplicant.name,
          email: selectedApplicant.email,
          phoneNumber: selectedApplicant.phoneNumber,
          description: selectedApplicant.description,
          images: selectedApplicant.images,
        } : null,
      };
    });

    res.status(200).json(processedProjects);
  } catch (error) {
    console.error("Error fetching projects by user ID:", error);
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

    // Handle images upload
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          const result = await uploadToCloudinary(file.buffer);
          images.push(result.secure_url);
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Failed to upload images" });
        }
      }
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    let application;
    let applicantDetails;

    // Get applicant details and create application
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
      default:
        return res.status(400).json({ error: "Invalid applicant type" });
    }

    // Determine project creator and their type
    let creatorId: string | undefined;
    let creatorType: "professor" | "student" | "business" | undefined;
    if (project.professorId) {
      creatorId = project.professorId;
      creatorType = "professor";
    } else if (project.studentId) {
      creatorId = project.studentId;
      creatorType = "student";
    } else if (project.businessId) {
      creatorId = project.businessId;
      creatorType = "business";
    }

    if (creatorId && creatorType) {
      // Prepare notification content
      let applicantInfo = "";
      if (!applicantDetails) {
        applicantInfo = "Unknown applicant";
      } else if ("department" in applicantDetails) {
        applicantInfo = `Professor ${applicantDetails.fullName} from ${applicantDetails.university}, ${applicantDetails.department}`;
      } else if ("course" in applicantDetails) {
        applicantInfo = `Student ${applicantDetails.fullName} from ${applicantDetails.university}, ${applicantDetails.course}`;
      } else {
        applicantInfo = `Business ${applicantDetails.companyName} in ${applicantDetails.industry} industry`;
      }

      const notificationContent = `
        New application received for your project
      `.trim();

      // Send notification to project creator
      await createNotification(
        NotificationType.PROJECT_APPLICATION,
        notificationContent,
        creatorId,
        creatorType,
        `/projects/${creatorType}`,
        project.id,
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

// Create R&D project for professors
export const createRDProject = async (req: Request, res: Response) => {
  try {
    const {
      businessId,
      topic,
      content,
      timeline,
      tags,
      eligibility,
      duration,
      isFunded,
      fundDetails,
      desirable,
    } = req.body;

    // Get business details for notification
    const creatingBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        companyName: true,
        email: true,
        phoneNumber: true,
        industry: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.BUSINESS_PROJECT,
        category: ProposalCategory.RND_PROJECT,
        status: Status.OPEN,
        timeline: timeline ? new Date(timeline) : null,
        tags,
        businessId,
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

    // Notify all professors
    const allProfessors = await prisma.professor.findMany({
      where: { isApproved: true },
    });

    const notificationContent = `
      New R&D Project Opportunity!
    `.trim();

    for (const professor of allProfessors) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        professor.id,
        "professor",
        "/projects/business",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating R&D project:", error);
    res.status(500).json({ error: "Failed to create R&D project" });
  }
};

// Create internship opportunity for students
export const createInternshipProject = async (req: Request, res: Response) => {
  try {
    const {
      businessId,
      topic,
      content,
      timeline,
      tags,
      eligibility,
      duration,
      isFunded,
      fundDetails,
      desirable,
    } = req.body;

    const creatingBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        companyName: true,
        email: true,
        phoneNumber: true,
        industry: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.BUSINESS_PROJECT,
        category: ProposalCategory.INTERNSHIP,
        status: Status.OPEN,
        timeline: timeline ? new Date(timeline) : null,
        tags,
        businessId,
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

    // Notify all students
    const allStudents = await prisma.student.findMany();

    const notificationContent = `
      New Internship Opportunity!
    `.trim();

    for (const student of allStudents) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        student.id,
        "student",
        "/projects/business",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating internship project:", error);
    res.status(500).json({ error: "Failed to create internship project" });
  }
};

// Create student proposal
export const createStudentProposal = async (req: Request, res: Response) => {
  try {
    const { studentId, topic, content, techDescription } = req.body;

    const creatingStudent = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        fullName: true,
        email: true,
        phoneNumber: true,
        university: true,
        course: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        topic,
        content,
        type: ProjectType.STUDENT_PROPOSAL,
        techDescription,
        status: Status.OPEN,
        studentId,
      },
    });

    // Notify professors and businesses based on proposal category
    const notificationContent = `
      New Student Proposal!
    `.trim();

    const [professors, businesses] = await Promise.all([
      prisma.professor.findMany({ where: { isApproved: true } }),
      prisma.business.findMany(),
    ]);

    // Notify both professors and businesses
    for (const professor of professors) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        professor.id,
        "professor",
        "/projects/student",
        project.id,
        "project"
      );
    }

    for (const business of businesses) {
      await createNotification(
        "PROJECT_APPLICATION",
        notificationContent,
        business.id,
        "business",
        "/projects/student",
        project.id,
        "project"
      );
    }

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating student proposal:", error);
    res.status(500).json({ error: "Failed to create student proposal" });
  }
};

// Assign participant and change status to ongoing
export const assignParticipant = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { applicationId, applicationType } = req.body;

    // Verify project exists and creator has permission
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        professor: true,
        business: true,
        student: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get application details based on type
    let application;
    let applicantId;
    let applicantType: "professor" | "student" | "business";
    let applicantDetails;

    switch (applicationType) {
      case "professor":
        application = await prisma.professorApplication.findUnique({
          where: { id: applicationId },
          include: { project: true },
        });
        applicantId = application?.professorId;
        applicantType = "professor";
        applicantDetails = await prisma.professor.findUnique({
          where: { id: applicantId },
          select: {
            fullName: true,
            email: true,
            university: true,
            department: true,
          },
        });
        break;
      case "student":
        application = await prisma.studentApplication.findUnique({
          where: { id: applicationId },
          include: { project: true },
        });
        applicantId = application?.studentId;
        applicantType = "student";
        applicantDetails = await prisma.student.findUnique({
          where: { id: applicantId },
          select: {
            fullName: true,
            email: true,
            university: true,
            course: true,
          },
        });
        break;
      case "business":
        application = await prisma.businessApplication.findUnique({
          where: { id: applicationId },
          include: { project: true },
        });
        applicantId = application?.businessId;
        applicantType = "business";
        applicantDetails = await prisma.business.findUnique({
          where: { id: applicantId },
          select: {
            companyName: true,
            email: true,
            industry: true,
          },
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid application type" });
    }

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update project status to ongoing
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: Status.ONGOING,
        selectedApplicationId: applicationId,
      },
    });

    // Create notification for the selected participant
    let notificationContent = `
      Congratulations! You have been selected for the project go to ongoing projects
    `.trim();
    if(project.category=="PROFESSOR_COLLABORATION"){
      notificationContent = `Congratulation! You have found a collaborator`.trim();
    }
    if (applicantId) {
      await createNotification(
        NotificationType.PROJECT_APPLICATION,
        notificationContent,
        applicantId,
        applicantType,
        `${applicantType}-profile/${applicantId}`,
        projectId,
        "project"
      );
    }

    // Notify other applicants they weren't selected
    const notifyOtherApplicants = async () => {
      const rejectionContent = `
        Update regarding project "${project.content}":
        Another participant has been selected for this project.
        Thank you for your interest.
      `.trim();

      // Get all applications and notify non-selected applicants
      const [professorApps, studentApps, businessApps] = await Promise.all([
        prisma.professorApplication.findMany({ where: { projectId } }),
        prisma.studentApplication.findMany({ where: { projectId } }),
        prisma.businessApplication.findMany({ where: { projectId } }),
      ]);

      for (const app of professorApps) {
        if (app.id !== applicationId) {
          await createNotification(
            NotificationType.PROJECT_APPLICATION,
            rejectionContent,
            app.professorId,
            "professor",
            `/professor-profile/${app.professorId}`,
            projectId,
            "project"
          );
        }
      }

      for (const app of studentApps) {
        if (app.id !== applicationId) {
          await createNotification(
            NotificationType.PROJECT_APPLICATION,
            rejectionContent,
            app.studentId,
            "student",
            `/student-profile/${app.studentId}`,
            projectId,
            "project"
          );
        }
      }

      for (const app of businessApps) {
        if (app.id !== applicationId) {
          await createNotification(
            NotificationType.PROJECT_APPLICATION,
            rejectionContent,
            app.businessId,
            "business",
            `/business-profile/${app.businessId}`,
            projectId,
            "project"
          );
        }
      }
    };

    await notifyOtherApplicants();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error assigning participant:", error);
    res.status(500).json({ error: "Failed to assign participant" });
  }
};

// Mark project as completed
export const completeProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { completionNotes } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        professor: true,
        business: true,
        student: true,
        professorApplications: true,
        studentApplications: true,
        businessApplications: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.status !== Status.ONGOING) {
      return res.status(400).json({
        error: "Only ONGOING projects can be marked as completed",
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: Status.CLOSED,
      },
    });

    // Create completion notification content
    const completionContent = `
      Project "${project.content}" has been marked as completed.
      ${completionNotes ? `\nCompletion Notes: ${completionNotes}` : ""}
    `.trim();

    // Notify all involved parties
    const notifyParties = async () => {
      // Notify project creator
      if (project.professorId) {
        await createNotification(
          NotificationType.PROJECT_APPLICATION,
          completionContent,
          project.professorId,
          "professor",
          `professor-profile/${project.professorId}`,
          projectId,
          "project"
        );
      } else if (project.businessId) {
        await createNotification(
          NotificationType.PROJECT_APPLICATION,
          completionContent,
          project.businessId,
          "business",
          `business-profile/${project.businessId}`,
          projectId,
          "project"
        );
      } else if (project.studentId) {
        await createNotification(
          NotificationType.PROJECT_APPLICATION,
          completionContent,
          project.studentId,
          "student",
          `student-profile/${project.studentId}`,
          projectId,
          "project"
        );
      }

      // Notify selected participant
      const selectedApp = [
        ...project.professorApplications,
        ...project.studentApplications,
        ...project.businessApplications,
      ].find((app) => app.id === project.selectedApplicationId);

      if (selectedApp) {
        let recipientId: string | undefined;
        let recipientType: "professor" | "business" | "student" | undefined;

        if ("professorId" in selectedApp) {
          recipientId = selectedApp.professorId;
          recipientType = "professor";
        } else if ("studentId" in selectedApp) {
          recipientId = selectedApp.studentId;
          recipientType = "student";
        } else if ("businessId" in selectedApp) {
          recipientId = selectedApp.businessId;
          recipientType = "business";
        }

        if (recipientId && recipientType) {
          await createNotification(
            NotificationType.PROJECT_APPLICATION,
            completionContent,
            recipientId,
            recipientType,
            `${recipientType}-profile/${recipientId}`,
            projectId,
            "project"
          );
        }
      }
    };

    await notifyParties();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error completing project:", error);
    res.status(500).json({ error: "Failed to complete project" });
  }
};

// // Get projects where a professor is enrolled as a participant
// export const getEnrolledProjectsForProfessor = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { professorId } = req.params;

//     const applications = await prisma.professorApplication.findMany({
//       where: { professorId },
//       select: { id: true },
//     });

//     const applicationIds = applications.map((app) => app.id);

//     const projects = await prisma.project.findMany({
//       where: {
//         status: Status.ONGOING,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     const closedProjects = await prisma.project.findMany({
//       where: {
//         status: Status.CLOSED,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     res.status(200).json([...projects, ...closedProjects]);
//   } catch (error) {
//     console.error("Error fetching enrolled projects for professor:", error);
//     res.status(500).json({ error: "Failed to fetch enrolled projects" });
//   }
// };

// // Get projects where a student is enrolled as a participant
// export const getEnrolledProjectsForStudent = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { studentId } = req.params;

//     const applications = await prisma.studentApplication.findMany({
//       where: { studentId },
//       select: { id: true },
//     });

//     const applicationIds = applications.map((app) => app.id);

//     const projects = await prisma.project.findMany({
//       where: {
//         status: Status.ONGOING,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     const closedProjects = await prisma.project.findMany({
//       where: {
//         status: Status.CLOSED,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     res.status(200).json([...projects, ...closedProjects]);
//   } catch (error) {
//     console.error("Error fetching enrolled projects for student:", error);
//     res.status(500).json({ error: "Failed to fetch enrolled projects" });
//   }
// };

// // Get projects where a business is enrolled as a participant
// export const getEnrolledProjectsForBusiness = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { businessId } = req.params;

//     const applications = await prisma.businessApplication.findMany({
//       where: { businessId },
//       select: { id: true },
//     });

//     const applicationIds = applications.map((app) => app.id);

//     const projects = await prisma.project.findMany({
//       where: {
//         status: Status.ONGOING,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     const closedProjects = await prisma.project.findMany({
//       where: {
//         status: Status.CLOSED,
//         selectedApplicationId: { in: applicationIds },
//       },
//       include: {
//         professor: true,
//         business: true,
//         student: true,
//         duration: true,
//       },
//     });

//     res.status(200).json([...projects, ...closedProjects]);
//   } catch (error) {
//     console.error("Error fetching enrolled projects for business:", error);
//     res.status(500).json({ error: "Failed to fetch enrolled projects" });
//   }
// };

// Get projects where a professor is enrolled as a participant
export const getEnrolledProjectsForProfessor = async (
  req: Request,
  res: Response
) => {
  try {
    const { professorId } = req.params;
    const { status } = req.query;

    // Fetch applications for the professor
    const applications = await prisma.professorApplication.findMany({
      where: { professorId },
      select: { id: true },
    });

    const applicationIds = applications.map((app) => app.id);

    // Build status filter
    const statusFilter = status
      ? { status: status as Status }
      : { status: { in: [Status.ONGOING, Status.CLOSED] } };

    // Fetch projects where the professor is enrolled
    const projects = await prisma.project.findMany({
      where: {
        selectedApplicationId: { in: applicationIds },
        ...statusFilter,
      },
      include: {
        professor: true,
        business: true,
        student: true,
        duration: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching enrolled projects for professor:", error);
    res.status(500).json({ error: "Failed to fetch enrolled projects" });
  }
};

// Get projects where a student is enrolled as a participant
export const getEnrolledProjectsForStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { studentId } = req.params;
    const { status } = req.query;

    // Fetch applications for the student
    const applications = await prisma.studentApplication.findMany({
      where: { studentId },
      select: { id: true },
    });

    const applicationIds = applications.map((app) => app.id);

    // Build status filter
    const statusFilter = status
      ? { status: status as Status }
      : { status: { in: [Status.ONGOING, Status.CLOSED] } };

    // Fetch projects where the student is enrolled
    const projects = await prisma.project.findMany({
      where: {
        selectedApplicationId: { in: applicationIds },
        ...statusFilter,
      },
      include: {
        professor: true,
        business: true,
        student: true,
        duration: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching enrolled projects for student:", error);
    res.status(500).json({ error: "Failed to fetch enrolled projects" });
  }
};

// Get projects where a business is enrolled as a participant
export const getEnrolledProjectsForBusiness = async (
  req: Request,
  res: Response
) => {
  try {
    const { businessId } = req.params;
    const { status } = req.query;

    // Fetch applications for the business
    const applications = await prisma.businessApplication.findMany({
      where: { businessId },
      select: { id: true },
    });

    const applicationIds = applications.map((app) => app.id);

    // Build status filter
    const statusFilter = status
      ? { status: status as Status }
      : { status: { in: [Status.ONGOING, Status.CLOSED] } };

    // Fetch projects where the business is enrolled
    const projects = await prisma.project.findMany({
      where: {
        selectedApplicationId: { in: applicationIds },
        ...statusFilter,
      },
      include: {
        professor: true,
        business: true,
        student: true,
        duration: true,
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching enrolled projects for business:", error);
    res.status(500).json({ error: "Failed to fetch enrolled projects" });
  }
};
