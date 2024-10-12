import { PrismaClient } from '@prisma/client';
import type{ Request, Response } from 'express';

const prisma = new PrismaClient();

export const postContact = async (req: Request, res: Response) => {
  try {
    const { email, fullName, subject, phoneNumber, message } = req.body;
    const contact = await prisma.contact.create({
      data: {
        email,
        fullName,
        subject,
        phoneNumber,
        message,
      },
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};