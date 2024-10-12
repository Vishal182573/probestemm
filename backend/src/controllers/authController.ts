import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import type {
  StudentData,
  ProfessorData,
  BusinessData,
  AdminData,
  UserRole,
} from "../types/auth";

const prisma = new PrismaClient();

const generateToken = (id: string, role: UserRole) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const studentSignup = async (req: Request, res: Response) => {
  try {
    const userData: StudentData = req.body;
    const file = req.file;

    // Check if email exists in the request body
    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await prisma.student.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let imageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    // Parse nested data if it's sent as JSON strings
    const researchHighlights = Array.isArray(userData.researchHighlights)
      ? userData.researchHighlights
      : JSON.parse(userData.researchHighlights as string);

    const education = Array.isArray(userData.education)
      ? userData.education
      : JSON.parse(userData.education as string);

    const achievements = Array.isArray(userData.achievements)
      ? userData.achievements
      : JSON.parse(userData.achievements as string);

    const user = await prisma.student.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        imageUrl,
        university: userData.university,
        course: userData.course,
        experience: userData.experience,
        researchHighlights: {
          create: researchHighlights,
        },
        education: {
          create: education,
        },
        achievements: {
          create: achievements,
        },
      },
    });

    const token = generateToken(user.id, "student");

    res.status(201).json({ user, token, role: "student" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const professorSignup = async (req: Request, res: Response) => {
  try {
    const userData: ProfessorData = req.body;
    const file = req.file;

    // Check if email exists in the request body
    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await prisma.professor.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let photoUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      photoUrl = result.secure_url;
    }

    // Parse nested data if it's sent as JSON strings
    const positions = Array.isArray(userData.positions)
      ? userData.positions
      : JSON.parse(userData.positions as string);

    const achievements = Array.isArray(userData.achievements)
      ? userData.achievements
      : JSON.parse(userData.achievements as string);

    const user = await prisma.professor.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        photoUrl,
        title: userData.title,
        university: userData.university,
        website: userData.website,
        degree: userData.degree, // Add this line
        department: userData.department,
        position: userData.position,
        researchInterests: userData.researchInterests,
        positions: {
          create: positions,
        },
        achievements: {
          create: achievements,
        },
      },
    });

    const token = generateToken(user.id, "professor");

    res.status(201).json({ user, token, role: "professor" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const businessSignup = async (req: Request, res: Response) => {
  try {
    const userData: BusinessData = req.body;
    const file = req.file;

    // Check if email exists in the request body
    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await prisma.business.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let profileImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      profileImageUrl = result.secure_url;
    }

    const user = await prisma.business.create({
      data: {
        companyName: userData.companyName,
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        industry: userData.industry,
        description: userData.description,
        website: userData.website,
        profileImageUrl,
      },
    });

    const token = generateToken(user.id, "business");

    res.status(201).json({ user, token, role: "business" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const adminSignup = async (req: Request, res: Response) => {
  try {
    const userData: AdminData = req.body;

    const existingUser = await prisma.superAdmin.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.superAdmin.create({
      data: {
        name: userData.fullName,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id, "admin");

    res.status(201).json({ user, token, role: "superAdmin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      role,
    }: { email: string; password: string; role: UserRole } = req.body;

    let user;
    switch (role) {
      case "student":
        user = await prisma.student.findUnique({ where: { email } });
        break;
      case "professor":
        user = await prisma.professor.findUnique({ where: { email } });
        break;
      case "business":
        user = await prisma.business.findUnique({ where: { email } });
        break;
      case "admin":
        user = await prisma.superAdmin.findUnique({ where: { email } });
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, role);

    res.json({ user, token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
