// controllers/faqController.ts

import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const FAQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return res.status(200).json(faqs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

export const getFAQById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    return res.status(200).json(faq);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const faqData = FAQSchema.parse(req.body);
    
    const newFAQ = await prisma.fAQ.create({
      data: faqData
    });

    return res.status(201).json(newFAQ);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = FAQSchema.parse(req.body);

    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updatedFAQ);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.fAQ.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};