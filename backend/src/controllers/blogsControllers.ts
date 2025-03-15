import { createNotification } from "./notificationController";
import type { Request, Response } from "express";
import {
  PrismaClient,
  UserType,
  BlogAuthorType,
  NotificationType,
} from "@prisma/client";
import { z } from "zod";
import cloudinary from "../config/cloudinary";

const prisma = new PrismaClient();

// Validation schemas
const BlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  blogImage: z.string().optional(),
});

const CommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "student" | "professor" | "business" | "admin";
    isapproved?: boolean;
  };
}

// Blog Routes handlers
const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
            university: true,
          },
        },
        business: {
          select: {
            id: true,
            companyName: true,
            industry: true,
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
            business: {
              select: {
                id: true,
                companyName: true,
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
    console.error("Error in getBlogs:", error);
    return res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
            university: true,
          },
        },
        business: {
          select: {
            id: true,
            companyName: true,
            industry: true,
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
            business: {
              select: {
                id: true,
                companyName: true,
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
    console.error("Error in getBlogById:", error);
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
};

const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = BlogSchema.parse(req.body);
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const file = req.file;

    const isapproved = req.user?.isapproved;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let blogImage = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      blogImage = result.secure_url;
    }


    if (userRole !== "professor" && userRole !== "business") {
      return res
        .status(403)
        .json({ error: "User not authorized to create blogs" });
    }

    if (userRole === "professor" && isapproved === false) {
      return res
        .status(403)
        .json({ error: "Professor not approved to create blogs" });
    }

    const blogData: any = {
      ...validatedData,
      blogImage,

      authorType:
        userRole === "professor"
          ? BlogAuthorType.PROFESSOR
          : BlogAuthorType.BUSINESS,
    };

    if (userRole === "professor") {
      blogData.professorId = userId;
    } else {
      blogData.businessId = userId;
    }

    const blog = await prisma.blog.create({
      data: blogData,
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
        business: {
          select: {
            id: true,
            companyName: true,
            industry: true,
          },
        },
      },
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error("Error in createBlog:", error);
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
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const file = req.file;

    if (!userId || (userRole !== "professor" && userRole !== "business")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (
      (userRole === "professor" && blog.professorId !== userId) ||
      (userRole === "business" && blog.businessId !== userId)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });
    }

    // Handle file upload if present
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      validatedData.blogImage = result.secure_url;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: validatedData,
      include: {
        professor: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
        business: {
          select: {
            id: true,
            companyName: true,
            industry: true,
          },
        },
      },
    });

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error in updateBlog:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update blog" });
  }
};

const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || (userRole !== "professor" && userRole !== "business")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (
      (userRole === "professor" && blog.professorId !== userId) ||
      (userRole === "business" && blog.businessId !== userId)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    await prisma.blog.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({ error: "Failed to delete blog" });
  }
};

const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const validatedData = CommentSchema.parse(req.body);
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const isapproved = req.user?.isapproved;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let commentData: any = {
      ...validatedData,
      blogId,
      userType: userRole === "student" ? UserType.STUDENT : 
        userRole === "professor" ? UserType.PROFESSOR : UserType.BUSINESS,
    };

    if (userRole === "student") {
      commentData.studentId = userId;
    } else if (userRole === "professor") {
      commentData.professorId = userId;
    } else if (userRole === "business") {
      commentData.businessId = userId;
      commentData.userType = UserType.BUSINESS; // Use PROFESSOR for business as well
    }

    if (userRole === "professor" && isapproved === false) {
      return res
        .status(403)
        .json({ error: "Professor not approved to create comments" });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
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
        business: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    const blogAuthorType = blog.professorId ? "professor" : "business";
    const blogAuthorId = blog.professorId || blog.businessId;

    if (!blogAuthorId) {
      return res.status(404).json({ error: "Blog author not found" });
    }

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error in createComment:", error);
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

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment author or the blog author
    const isCommentAuthor =
      (userRole === "student" && comment.studentId === userId) ||
      (userRole === "professor" && comment.professorId === userId) ||
      (userRole === "business" && comment.businessId === userId);

    const isBlogAuthor =
      (userRole === "professor" && comment.blog.professorId === userId) ||
      (userRole === "business" && comment.blog.businessId === userId);

    if (!isCommentAuthor && !isBlogAuthor) {
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
        business: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error in updateComment:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { blog: true },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment author or the blog author
    const isCommentAuthor =
      (userRole === "student" && comment.studentId === userId) ||
      (userRole === "professor" && comment.professorId === userId) ||
      (userRole === "business" && comment.businessId === userId);

    const isBlogAuthor =
      (userRole === "professor" && comment.blog.professorId === userId) ||
      (userRole === "business" && comment.blog.businessId === userId);

    if (!isCommentAuthor && !isBlogAuthor) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error in deleteComment:", error);
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

const toggleBlogLike = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const isapproved = req.user?.isapproved;

    if (!userId || !userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (userRole === "professor" && isapproved === false) {
      return res
        .status(403)
        .json({ error: "Professor not approved to like/dislike blogs" });
    }

    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId: id,
          userId,
        },
      },
    });

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        professor: true,
        business: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (existingLike) {
      // If like exists, remove it
      await prisma.blogLike.delete({
        where: {
          blogId_userId: {
            blogId: id,
            userId,
          },
        },
      });

      // Update blog counts
      await prisma.blog.update({
        where: { id },
        data: {
          likes: existingLike.isLike ? { decrement: 1 } : { decrement: 0 },
          dislikes: !existingLike.isLike ? { decrement: 1 } : { decrement: 0 },
        },
      });

      return res.status(200).json({ message: "Interaction removed" });
    } else {
      // If no like exists, create a new one
      const isLike = req.body.isLike;
      const newLike = await prisma.blogLike.create({
        data: {
          blogId: id,
          userId,
          isLike,
        },
      });

      // Update blog counts
      await prisma.blog.update({
        where: { id },
        data: {
          likes: isLike ? { increment: 1 } : { increment: 0 },
          dislikes: !isLike ? { increment: 1 } : { increment: 0 },
        },
      });

      // Fetch user details based on role
      let userName = "Anonymous";
      if (userRole === "student") {
        const student = await prisma.student.findUnique({
          where: { id: userId },
        });
        userName = student?.fullName || "Anonymous Student";
      } else if (userRole === "professor") {
        const professor = await prisma.professor.findUnique({
          where: { id: userId },
        });
        userName = professor?.fullName || "Anonymous Professor";
      } else if (userRole === "business") {
        const business = await prisma.business.findUnique({
          where: { id: userId },
        });
        userName = business?.companyName || "Anonymous Business";
      }

      // Determine blog author and create notification
      const authorId = blog.professorId || blog.businessId;
      const authorType = blog.professorId ? "professor" : "business";

      if (authorId) {
        await createNotification(
          NotificationType.LIKE,
          `New ${isLike ? "like" : "dislike"} on your blog "${
            blog.title
          }" by ${userName}`,
          authorId,
          authorType,
          id,
          "blog"
        );
      }

      return res.status(200).json({ message: "Interaction added" });
    }
  } catch (error) {
    console.error("Error in toggleBlogLike:", error);
    return res
      .status(500)
      .json({ error: "Failed to toggle blog like/dislike" });
  }
};

const getRelatedBlogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        NOT: {
          id: id,
        },
      },
      select: {
        id: true,
        title: true,
        blogImage: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(relatedBlogs);
  } catch (error) {
    console.error("Error in getRelatedBlogs:", error);
    return res.status(500).json({ error: "Failed to fetch related blogs" });
  }
};

export default {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,

  createComment,
  updateComment,
  deleteComment,
  userInteraction,
  toggleBlogLike,
  getRelatedBlogs,
};
