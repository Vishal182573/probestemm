import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { UserRole } from "../types/auth";

const prisma = new PrismaClient();

interface DecodedToken {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

export const professorAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== "professor") {
        return res
          .status(403)
          .json({ error: "Access denied. Professor role required." });
      }
      const professor = await prisma.professor.findUnique({
        where: { id: req.user.id },
      });
      if (!professor) {
        return res.status(404).json({ error: "Professor not found." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Please authenticate as a professor." });
  }
};

export const businessAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== "business") {
        return res
          .status(403)
          .json({ error: "Access denied. Business role required." });
      }
      const business = await prisma.business.findUnique({
        where: { id: req.user.id },
      });
      if (!business) {
        return res.status(404).json({ error: "Business not found." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Please authenticate as a business." });
  }
};

export const studentAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== "student") {
        return res
          .status(403)
          .json({ error: "Access denied. Student role required." });
      }
      const student = await prisma.student.findUnique({
        where: { id: req.user.id },
      });
      if (!student) {
        return res.status(404).json({ error: "Student not found." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Please authenticate as a student." });
  }
};

export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Access denied. Admin role required." });
      }
      const admin = await prisma.superAdmin.findUnique({
        where: { id: req.user.id },
      });
      if (!admin) {
        return res.status(404).json({ error: "Admin not found." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Please authenticate as an admin." });
  }
};
