import { type Request, type Response } from 'express';
import { PrismaClient, DiscussionStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const DiscussionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().min(1),
  studentId: z.string().min(1),
});

const AnswerSchema = z.object({
  content: z.string().min(1),
  professorId: z.string().min(1),
});

// GET /api/discussions
export const getDiscussions = async (req: Request, res: Response) => {
  try {
      const discussions = await prisma.discussion.findMany({
          include: {
              student: true,
              answers: {
                  include: {
                      professor: true,
                  },
              },
          },
      });
      return res.status(200).json(discussions);
  } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch discussions' });
  }
};

// GET /api/discussions/:id
export const getDiscussionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        student: true,
        answers: {
          include: {
            professor: true,
          },
        },
      },
    });

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    return res.status(200).json(discussion);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch discussion' });
  }
};

// POST /api/discussions
export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const validatedData = DiscussionSchema.parse(req.body);
    const discussion = await prisma.discussion.create({
      data: {
        ...validatedData,
        status: DiscussionStatus.UNANSWERED,
      },
    });
    return res.status(201).json(discussion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create discussion' });
  }
};

// POST /api/discussions/:id/answers
export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { id: discussionId } = req.params;
    const validatedData = AnswerSchema.parse(req.body);

    const answer = await prisma.answer.create({
      data: {
        ...validatedData,
        discussionId,
      },
    });

    // Update discussion status to ANSWERED
    await prisma.discussion.update({
      where: { id: discussionId },
      data: { status: DiscussionStatus.ANSWERED },
    });

    return res.status(201).json(answer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create answer' });
  }
};

// PUT /api/discussions/:id
// export const updateDiscussion = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const validatedData = DiscussionSchema.partial().parse(req.body);
    
//     const discussion = await prisma.discussion.update({
//       where: { id },
//       data: validatedData,
//     });
    
//     return res.status(200).json(discussion);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update discussion' });
//   }
// };