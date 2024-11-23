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

const BusinessSearchQuerySchema = z.object({
  query: z.string().optional(),
  field: z.enum(['companyName', 'industry', 'location']).optional(),
}).transform(data => ({
  query: data.query?.trim() || undefined,
  field: data.field
}));

export const searchBusinesses = async (req: Request, res: Response) => {
  try {
    // Parse and validate the query parameters
    const { query, field } = BusinessSearchQuerySchema.parse(req.query);

    // Define the select object for consistent field selection
    const selectFields = {
      id: true,
      companyName: true,
      email: true,
      phoneNumber: true,
      location: true,
      industry: true,
      description: true,
      website: true,
      profileImageUrl: true,
      createdAt: true,
      updatedAt: true,
    };

    // Base where clause
    let whereClause: any = {};

    // If a query is provided, add search conditions
    if (query) {
      if (field) {
        // Search in specific field
        whereClause[field] = {
          contains: query,
          mode: 'insensitive',
        };
      } else {
        // Search across all relevant fields
        whereClause.OR = [
          { companyName: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ];
      }
    }

    // Execute the query with logging for debugging
    console.log('Business Search Query:', JSON.stringify(whereClause, null, 2));
    
    const businesses = await prisma.business.findMany({
      where: whereClause,
      select: selectFields,
      orderBy: {
        createdAt: 'desc',
      },
      // Add pagination to handle large result sets
      take: 50,
    });

    console.log(`Found ${businesses.length} businesses`);

    // Return results with metadata
    return res.status(200).json({
      count: businesses.length,
      data: businesses,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Invalid search parameters", 
        details: error.errors 
      });
    }

    console.error("Error searching businesses:", error);
    return res.status(500).json({ error: "Failed to search businesses" });
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
