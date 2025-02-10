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
  try {
    // First verify that the recipient exists
    let recipientExists = false;
    
    switch (recipientType) {
      case "professor":
        recipientExists = await prisma.professor.findUnique({
          where: { id: recipientId }
        }) !== null;
        break;
      case "student":
        recipientExists = await prisma.student.findUnique({
          where: { id: recipientId }
        }) !== null;
        break;
      case "business":
        recipientExists = await prisma.business.findUnique({
          where: { id: recipientId }
        }) !== null;
        break;
    }

    if (!recipientExists) {
      throw new Error(`${recipientType} with ID ${recipientId} does not exist`);
    }

    // If related entity is provided, verify it exists
    if (relatedEntityId && relatedEntityType) {
      let entityExists = false;
      
      switch (relatedEntityType) {
        case "project":
          entityExists = await prisma.project.findUnique({
            where: { id: relatedEntityId }
          }) !== null;
          break;
        case "webinar":  // Add this case
         entityExists = await prisma.webinar.findUnique({
           where: { id: relatedEntityId }
         }) !== null;
         break;
        case "discussion":  // Add discussion case
          entityExists = await prisma.discussion.findUnique({
            where: { id: relatedEntityId }
          }) !== null;
          break;
        // Add other entity checks as needed
      }

      if (!entityExists) {
        throw new Error(`${relatedEntityType} with ID ${relatedEntityId} does not exist`);
      }
    }

    const notificationData: any = {
      type,
      content,
      redirectionLink,
      [`${recipientType}Id`]: recipientId
    };

    if (relatedEntityId && relatedEntityType) {
      notificationData[`${relatedEntityType}Id`] = relatedEntityId;
    }

    const notification = await prisma.notification.create({
      data: notificationData,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
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
