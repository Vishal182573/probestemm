import { PrismaClient, UserType, DiscussionStatus, VoteType } from '@prisma/client';
import type{ Request, Response } from 'express';

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
    res.status(500).json({ error: 'Failed to create discussion' });
  }
};

export const answerDiscussion = async (req: Request, res: Response) => {
  try {
    const { content, discussionId, userType, userId } = req.body;

    if (userType !== UserType.PROFESSOR && userType !== "BUSINESS") {
      return res.status(403).json({ error: 'Only professors or businesses can answer discussions' });
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
    res.status(500).json({ error: 'Failed to answer discussion' });
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
        return res.status(400).json({ error: 'You have already voted' });
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
    res.status(500).json({ error: 'Failed to vote on discussion' });
  }
};

export const searchDiscussions = async (req: Request, res: Response) => {
  try {
    const { searchString } = req.query;

    const discussions = await prisma.discussion.findMany({
      where: {
        title: {
          contains: searchString as string,
          mode: 'insensitive',
        },
      },
      include: {
        student: true,
        answers: true,
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search discussions' });
  }
};

export const getRecentDiscussions = async (req: Request, res: Response) => {
  try {
    const discussions = await prisma.discussion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      include: {
        student: true,
        answers: true,
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recent discussions' });
  }
};

export const getMostVotedDiscussions = async (req: Request, res: Response) => {
  try {
    const discussions = await prisma.discussion.findMany({
      orderBy: {
        upvotes: 'desc',
      },
      take: 10,
      include: {
        student: true,
        answers: true,
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get most voted discussions' });
  }
};

export const getDiscussionsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const whereClause = status === 'all' ? {} : { status: status as DiscussionStatus };

    const discussions = await prisma.discussion.findMany({
      where: whereClause,
      include: {
        student: true,
        answers: true,
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get discussions by status' });
  }
};

export const getDiscussionsByCategoryAndSubcategory = async (req: Request, res: Response) => {
  try {
    const { category, subcategory } = req.query;

    const discussions = await prisma.discussion.findMany({
      where: {
        category: category as string,
        subcategory: subcategory as string,
      },
      include: {
        student: true,
        answers: true,
      },
    });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get discussions by category and subcategory' });
  }
};