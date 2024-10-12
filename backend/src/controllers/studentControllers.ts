import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        researchHighlights: true,
        education: true,
        achievements: true,
        discussions: true,
        comments: true,
        projects: true,
      },
    });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        researchHighlights: true,
        education: true,
        achievements: true,
        discussions: true,
        comments: true,
        projects: true,
      },
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

// POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      location,
      imageUrl,
      university,
      course,
      experience,
    } = req.body;

    const student = await prisma.student.create({
      data: {
        fullName,
        email,
        password,
        phoneNumber,
        location,
        imageUrl,
        university,
        course,
        experience,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      phoneNumber,
      location,
      imageUrl,
      university,
      course,
      experience,
    } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        email,
        password,
        phoneNumber,
        location,
        imageUrl,
        university,
        course,
        experience,
      },
    });
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};