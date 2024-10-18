import {
  PrismaClient,
  UserType,
  DiscussionStatus,
  VoteType,
} from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const createDiscussion = async (req: Request, res: Response) => {
  try {
    const { title, description, category, subcategory, studentId } = req.body;

    const discussion = await prisma.discussion.create({
      data: {
        title,
        description,
        category,
        subcategory,
        student: { connect: { id: studentId } },
      },
    });

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create discussion" });
  }
};

export const answerDiscussion = async (req: Request, res: Response) => {
  try {
    const { content, discussionId, userType, userId } = req.body;

    if (userType === UserType.STUDENT) {
      return res.status(400).json({ error: "Students cannot answer" });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        discussion: { connect: { id: discussionId } },
        [userType.toLowerCase()]: { connect: { id: userId } },
      },
    });

    await prisma.discussion.update({
      where: { id: discussionId },
      data: {
        status: DiscussionStatus.ANSWERED,
        answerCount: { increment: 1 },
      },
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: "Failed to answer discussion" });
  }
};

export const voteDiscussion = async (req: Request, res: Response) => {
  try {
    const { discussionId, userId, userType, voteType } = req.body;

    const existingVote = await prisma.vote.findUnique({
      where: {
        discussionId_userId_userType: {
          discussionId,
          userId,
          userType,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        return res.status(400).json({ error: "You have already voted" });
      }

      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });
    } else {
      await prisma.vote.create({
        data: {
          discussion: { connect: { id: discussionId } },
          userId,
          userType,
          voteType,
        },
      });
    }

    const updatedDiscussion = await prisma.discussion.update({
      where: { id: discussionId },
      data: {
        upvotes: {
          increment: voteType === VoteType.UPVOTE ? 1 : 0,
        },
        downvotes: {
          increment: voteType === VoteType.DOWNVOTE ? 1 : 0,
        },
      },
    });

    res.status(200).json(updatedDiscussion);
  } catch (error) {
    res.status(500).json({ error: "Failed to vote on discussion" });
  }
};

export const searchDiscussions = async (req: Request, res: Response) => {
  try {
    const {
      searchString,
      status,
      category,
      subcategory,
      sortBy,
      page = 1,
      pageSize = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    let whereClause: any = {};
    let orderBy: any = {};

    // Apply filters
    if (searchString) {
      whereClause.title = {
        contains: searchString as string,
        mode: "insensitive",
      };
    }

    if (status && status !== "all") {
      whereClause.status = status as DiscussionStatus;
    }

    if (category) {
      whereClause.category = category as string;
    }

    if (subcategory) {
      whereClause.subcategory = subcategory as string;
    }

    // Apply sorting
    if (sortBy === "recent") {
      orderBy.createdAt = "desc";
    } else if (sortBy === "mostVoted") {
      orderBy.upvotes = "desc";
    }

    const [discussions, totalCount] = await Promise.all([
      prisma.discussion.findMany({
        where: whereClause,
        orderBy: orderBy,
        skip,
        take: Number(pageSize),
        include: {
          student: true,
          answers: true,
        },
      }),
      prisma.discussion.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / Number(pageSize));

    res.status(200).json({
      discussions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        pageSize: Number(pageSize),
        totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to search discussions" });
  }
};

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
            business: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        votes: true,
      },
    });

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch discussion" });
  }
};
