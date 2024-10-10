// src/controllers/authController.ts

import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validation schemas
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  passingYear: z.string(),
});

const ResearchHighlightSchema = z.object({
  title: z.string(),
  status: z.enum(["ONGOING", "COMPLETED"]),
});

const PositionSchema = z.object({
  title: z.string(),
  institution: z.string(),
  startYear: z.string(),
  endYear: z.string().optional(),
  current: z.boolean().default(false),
});

const AchievementSchema = z.object({
  year: z.string(),
  description: z.string(),
});

const StudentSchema = UserSchema.extend({
  fullName: z.string().min(1),
  phoneNumber: z.string(),
  location: z.string(),
  university: z.string(),
  course: z.string(),
  researchHighlights: z.array(ResearchHighlightSchema).default([]),
  experience: z.string().default(""),
  education: z.array(EducationSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
});

const ProfessorSchema = UserSchema.extend({
  fullName: z.string().min(1),
  phoneNumber: z.string(),
  location: z.string(),
  title: z.string(),
  university: z.string(),
  website: z.string().url().optional().default(""),
  degree: z.string(),
  department: z.string(),
  position: z.string(),
  researchInterests: z.string().default(""),
  positions: z.array(PositionSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
});

const BusinessSchema = UserSchema.extend({
  companyName: z.string().min(1),
  phoneNumber: z.string(),
  location: z.string(),
  industry: z.string(),
  description: z.string(),
  website: z.string().url().optional(),
});

const AdminSchema = UserSchema.extend({
  name: z.string().min(1),
});

// Helper functions
const tryParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

// Controllers
export const studentSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const formData = req.body;
    const researchHighlights = tryParseJSON(formData.researchHighlights) || [];
    const parsedEducation = tryParseJSON(formData.education) || [];
    const parsedAchievements = tryParseJSON(formData.achievements) || [];

    const validatedData = StudentSchema.parse({
      ...formData,
      researchHighlights,
      education: parsedEducation,
      achievements: parsedAchievements,
      // Provide default values for potentially undefined fields
      experience: formData.experience || "",
    });

    const {
      email,
      password,
      education,
      achievements,
      researchHighlights: parsedResearchHighlights,
      ...rest
    } = validatedData;

    const existingUser = await prisma.student.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const student = await prisma.student.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
        imageUrl,
        researchHighlights: {
          create: parsedResearchHighlights,
        },
        education: {
          create: education,
        },
        achievements: {
          create: achievements,
        },
      },
      include: {
        education: true,
        researchHighlights: true,
        achievements: true,
      },
    });

    const token = generateToken(student.id, "student");
    res.status(201).json({ student, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create student" });
  }
};

export const professorSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const formData = req.body;
    const validatedData = ProfessorSchema.parse({
      ...formData,
      positions: JSON.parse(formData.positions || "[]"),
      achievements: JSON.parse(formData.achievements || "[]"),
    });

    const { email, password, positions, achievements, ...rest } = validatedData;

    const existingUser = await prisma.professor.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    let photoUrl;
    if (req.file) {
      photoUrl = await uploadImage(req.file);
    }

    const professor = await prisma.professor.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
        photoUrl,
        positions: {
          create: positions,
        },
        achievements: {
          create: achievements,
        },
      },
      include: {
        positions: true,
        achievements: true,
      },
    });

    const token = generateToken(professor.id, "professor");
    res.status(201).json({ professor, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create professor" });
  }
};

export const businessSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = BusinessSchema.parse(req.body);
    const { email, password, website = "", ...rest } = validatedData;

    const existingUser = await prisma.business.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const business = await prisma.business.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
        website,
      },
    });

    const token = generateToken(business.id, "business");
    res.status(201).json({ business, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create business" });
  }
};
export const adminSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = AdminSchema.parse(req.body);
    const { email, password, name } = validatedData;

    const existingUser = await prisma.superAdmin.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.superAdmin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = generateToken(admin.id, "admin");
    res.status(201).json({ admin, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to create admin" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = UserSchema.parse(req.body);

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        education: true,
        researchHighlights: true,
        achievements: true,
      },
    });
    const professor = await prisma.professor.findUnique({
      where: { email },
      include: {
        positions: true,
        achievements: true,
      },
    });
    const business = await prisma.business.findUnique({ where: { email } });
    const admin = await prisma.superAdmin.findUnique({ where: { email } });

    let user;
    let role;

    if (student) {
      user = student;
      role = "student";
    } else if (professor) {
      user = professor;
      role = "professor";
    } else if (business) {
      user = business;
      role = "business";
    } else if (admin) {
      user = admin;
      role = "admin";
    }

    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, role as string);
    res.status(200).json({ user, token, role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: "Failed to sign in" });
  }
};

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: Function
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

      (req as any).user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
