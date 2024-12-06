// controllers/notificationController.ts

import { PrismaClient, NotificationType } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const createNotification = async (
  type: NotificationType,
  content: string,
  recipientId: string,
  recipientType: "student" | "professor" | "business",
  redirectionLink?: string,
  relatedEntityId?: string,
  relatedEntityType?:
    | "blog"
    | "webinar"
    | "discussion"
    | "project"
    | "patent"
    | "tags"
    | "professor-approval"
) => {
  const notificationData: any = {
    type,
    content,
    redirectionLink
  };

  notificationData[`${recipientType}Id`] = recipientId;

  // Add related entity if provided
  if (relatedEntityId && relatedEntityType) {
    notificationData[`${relatedEntityType}Id`] = relatedEntityId;
  }

  await prisma.notification.create({
    data: notificationData,
  });
};

export const getNotifications = async (req: Request, res: Response) => {
  const { userId, userType } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        [`${userType}Id`]: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};
