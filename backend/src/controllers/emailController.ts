import type{ Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/sendEmail.ts';
import generateCode from '../utils/otp.ts';

const prisma = new PrismaClient();

// Send email with code
export const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists in the database
    const existingEntry = await prisma.emailVerification.findUnique({ where: { email } });
    if (existingEntry) {
      await prisma.emailVerification.delete({ where: { email } });
    }

    const code = generateCode();

    await sendEmail({
      to: email,
      subject: 'Your Verification Code',
      code, 
    });

    // Create a new entry in the database
    await prisma.emailVerification.create({
      data: {
        email,
        code,
      },
    });

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Validate the code
export const validateCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const entry = await prisma.emailVerification.findUnique({ where: { email } });

    if (entry && entry.code === code) {
      await prisma.emailVerification.delete({ where: { email } });
      return res.status(200).json({ message: 'Code verified successfully' });
    } else {
      if (entry) {
        await prisma.emailVerification.delete({ where: { email } });
      }
      return res.status(400).json({ error: 'Invalid code or email' });
    }
  } catch (error) {
    console.error('Error validating code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
