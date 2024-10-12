import type { Request, Response } from "express";
import { PrismaClient, UserType } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

const CommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "student" | "professor" | "business" | "admin";
  };
}

// Blog Routes handlers
const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            title: true,
            university: true,
          },
        },
        comments: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
              },
            },
            professor: {
              select: {
                id: true,
                fullName: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch blogs" });
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
            fullName: true,
            title: true,
            university: true,
          },
        },
        comments: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
              },
            },
            professor: {
              select: {
                id: true,
                fullName: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
};

const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = BlogSchema.parse(req.body);
    const professorId = req.user?.id;

    if (!professorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blog = await prisma.blog.create({
      data: {
        ...validatedData,
        professorId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
      },
    });

    return res.status(201).json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to create blog" });
  }
};

const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = BlogSchema.partial().parse(req.body);
    const professorId = req.user?.id;

    if (!professorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blog = await prisma.blog.update({
      where: {
        id,
        professorId,
      },
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
      },
    });

    return res.status(200).json(blog);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update blog" });
  }
};

const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const professorId = req.user?.id;

    if (!professorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.blog.delete({
      where: {
        id,
        professorId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete blog" });
  }
};

const likeBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the user has already liked or disliked the blog
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId: id,
          userId,
        },
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already interacted with this blog" });
    }

    // Create a new like
    await prisma.blogLike.create({
      data: {
        blogId: id,
        userId,
        isLike: true,
      },
    });

    // Update the blog's like count
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json({ error: "Failed to like blog" });
  }
};

const dislikeBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the user has already liked or disliked the blog
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId: id,
          userId,
        },
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ error: "You have already interacted with this blog" });
    }

    // Create a new dislike
    await prisma.blogLike.create({
      data: {
        blogId: id,
        userId,
        isLike: false,
      },
    });

    // Update the blog's dislike count
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        dislikes: {
          increment: 1,
        },
      },
    });

    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json({ error: "Failed to dislike blog" });
  }
};

const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const validatedData = CommentSchema.parse(req.body);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userType =
      userRole === "student" ? UserType.STUDENT : UserType.PROFESSOR;

    let commentData: any = {
      ...validatedData,
      blogId,
      userType,
    };

    if (userType === UserType.STUDENT) {
      commentData.studentId = userId;
    } else if (userType === UserType.PROFESSOR) {
      commentData.professorId = userId;
    }

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const validatedData = CommentSchema.parse(req.body);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userType =
      userRole === "student" ? UserType.STUDENT : UserType.PROFESSOR;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment author or the blog author
    if (
      (userType === UserType.STUDENT && comment.studentId !== userId) ||
      (userType === UserType.PROFESSOR &&
        comment.professorId !== userId &&
        comment.blog.professorId !== userId)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: validatedData,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
      },
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userType =
      userRole === "student" ? UserType.STUDENT : UserType.PROFESSOR;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment author or the blog author
    if (
      (userType === UserType.STUDENT && comment.studentId !== userId) ||
      (userType === UserType.PROFESSOR &&
        comment.professorId !== userId &&
        comment.blog.professorId !== userId)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete comment" });
  }
};

const userInteraction = async (req: AuthenticatedRequest, res: Response) => {
  // provide the current like or dislike status of the user

  const { blogId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userInteraction = await prisma.blogLike.findUnique({
    where: {
      blogId_userId: {
        blogId,
        userId,
      },
    },
  });

  return res.status(200).json(userInteraction);
};

export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  createComment,
  updateComment,
  deleteComment,
  userInteraction,
};
