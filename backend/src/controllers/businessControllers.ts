import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const BusinessSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string(),
  location: z.string(),
  industry: z.string(),
  description: z.string(),
  website: z.string().url().optional(),
  profileImageUrl: z.string().url().optional(),
});

const BusinessFilterSchema = z.object({
  companyName: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
}).optional();

export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const filters = BusinessFilterSchema.parse(req.query);
    
    const where: any = {};

    if (filters?.companyName) {
      where.companyName = {
        contains: filters.companyName,
        mode: 'insensitive'
      };
    }

    if (filters?.industry) {
      where.industry = {
        contains: filters.industry,
        mode: 'insensitive'
      };
    }

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive'
      };
    }

    if (filters?.website) {
      where.website = {
        contains: filters.website,
        mode: 'insensitive'
      };
    }

    const businesses = await prisma.business.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        industry: true,
        location: true,
        website: true,
        profileImageUrl: true,
        email: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            id: true,
            topic: true,
            status: true,
          }
        }
      }
    });

    return res.status(200).json(businesses);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to fetch businesses" });
  }
};


export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        projects: true,
        answers: {
          include: {
            discussion: true,
          },
        },
      },
    });

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    return res.status(200).json(business);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch business" });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = BusinessSchema.parse(req.body);

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedBusiness);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update business" });
  }
};
