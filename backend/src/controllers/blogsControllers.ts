import { type Request, type Response } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
import { z } from 'zod';
const prisma = new PrismaClient();

// Validation schemas
const BlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  professorId: z.string().min(1, 'Professor ID is required'),
});

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  userType: z.nativeEnum(UserType),
  studentId: z.string().optional(),
  professorId: z.string().optional(),
});

// Blog Routes handlers
const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            title: true,
            university: true,
          }
        },
        comments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
              }
            },
            professor: {
              select: {
                id: true,
                name: true,
                title: true,
              }
            },
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            title: true,
            university: true,
          }
        },
        comments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
              }
            },
            professor: {
              select: {
                id: true,
                name: true,
                title: true,
              }
            },
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

const createBlog = async (req: Request, res: Response) => {
  try {
    const validatedData = BlogSchema.parse(req.body);
    
    const professorExists = await prisma.professor.findUnique({
      where: { id: validatedData.professorId }
    });

    if (!professorExists) {
      return res.status(404).json({ error: 'Professor not found' });
    }

    const blog = await prisma.blog.create({
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            title: true,
          }
        }
      }
    });
    
    return res.status(201).json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create blog' });
  }
};

// const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const validatedData = BlogSchema.partial().parse(req.body);
    
//     const blog = await prisma.blog.update({
//       where: { id },
//       data: validatedData,
//       include: {
//         author: {
//           select: {
//             id: true,
//             name: true,
//             title: true,
//           }
//         }
//       }
//     });
    
//     return res.status(200).json(blog);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update blog' });
//   }
// };

const likeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to like blog' });
  }
};

const dislikeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        dislikes: {
          increment: 1
        }
      }
    });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to dislike blog' });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const validatedData = CommentSchema.parse(req.body);

    if (validatedData.userType === UserType.STUDENT && !validatedData.studentId) {
      return res.status(400).json({ error: 'Student ID is required for student comments' });
    }
    if (validatedData.userType === UserType.PROFESSOR && !validatedData.professorId) {
      return res.status(400).json({ error: 'Professor ID is required for professor comments' });
    }

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        blogId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          }
        },
        professor: {
          select: {
            id: true,
            name: true,
            title: true,
          }
        }
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: 'Failed to create comment' });
  }
};

// const updateComment = async (req: Request, res: Response) => {
//   try {
//     const { commentId } = req.params;
//     const validatedData = CommentSchema.partial().parse(req.body);

//     const comment = await prisma.comment.update({
//       where: { id: commentId },
//       data: validatedData,
//       include: {
//         student: {
//           select: {
//             id: true,
//             name: true,
//           }
//         },
//         professor: {
//           select: {
//             id: true,
//             name: true,
//             title: true,
//           }
//         }
//       }
//     });

//     return res.status(200).json(comment);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ error: error.errors });
//     }
//     return res.status(500).json({ error: 'Failed to update comment' });
//   }
// };


// Default export containing all controller functions
export default {
  getBlogs,
  getBlogById,
  createBlog,
  likeBlog,
  dislikeBlog,
  createComment,
};