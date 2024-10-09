import { type Request, type Response } from 'express';
import { PrismaClient, WebinarStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for webinars
const WebinarSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  topic: z.string().min(1, 'Topic is required'),
  place: z.string().min(1, 'Place is required'),
  date: z.string().transform((str) => new Date(str)),
  status: z.nativeEnum(WebinarStatus).default(WebinarStatus.PENDING),
  professorId: z.string().min(1, 'Professor ID is required'),
  maxAttendees: z.number().optional(),
  duration: z.number().optional(),
  isOnline: z.boolean().default(true),
  meetingLink: z.string().optional(),
});

// Controller functions
const getWebinars = async (req: Request, res: Response) => {
  try {
    const webinars = await prisma.webinar.findMany({
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            title: true,
            university: true,
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    return res.status(200).json(webinars);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch webinars' });
  }
};

const getWebinarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            title: true,
            university: true,
          }
        }
      }
    });

    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    return res.status(200).json(webinar);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch webinar' });
  }
};

const createWebinar = async (req: Request, res: Response) => {
  try {
    const validatedData = WebinarSchema.parse(req.body);
    
    const professorExists = await prisma.professor.findUnique({
      where: { id: validatedData.professorId }
    });

    if (!professorExists) {
      return res.status(404).json({ error: 'Professor not found' });
    }

    const webinar = await prisma.webinar.create({
      data: validatedData,
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            title: true,
          }
        }
      }
    });
    
    return res.status(201).json(webinar);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create webinar' });
  }
};

// const updateWebinar = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const validatedData = WebinarSchema.partial().parse(req.body);
    
//     const webinar = await prisma.webinar.update({
//       where: { id },
//       data: validatedData,
//       include: {
//         professor: {
//           select: {
//             id: true,
//             name: true,
//             title: true,
//           }
//         }
//       }
//     });
    
//     return res.status(200).json(webinar);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update webinar' });
//   }
// };

const deleteWebinar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.webinar.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete webinar' });
  }
};

const updateWebinarStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(WebinarStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid webinar status' });
    }

    const webinar = await prisma.webinar.update({
      where: { id },
      data: { status },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            title: true,
          }
        }
      }
    });
    
    return res.status(200).json(webinar);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update webinar status' });
  }
};

export default {
  getWebinars,
  getWebinarById,
  createWebinar,
  deleteWebinar,
  updateWebinarStatus
};