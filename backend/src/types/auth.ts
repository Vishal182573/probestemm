import type { Student, Professor, Business, SuperAdmin } from "@prisma/client";

export type UserRole = "student" | "professor" | "business" | "admin";

interface ResearchInterest {
  title: string;
  description?: string;
  imageUrl?: string;
}

interface Tag {
  category: string;
  subcategory: string;
}

export interface UserData {
  fullName: string;
  email: string;
  password: string;
}

export interface StudentData extends UserData {
  phoneNumber: string;
  location: string;
  university: string;
  course: string;
  researchHighlights: ResearchHighlight[];
  experience: string;
  education: Education[];
  achievements: Achievement[];
}

export interface ProfessorData extends UserData {
  phoneNumber: string;
  location: string;
  title: string;
  university: string;
  website?: string;
  degree: string;
  department: string;
  position: string;
  bio:string;

  positions: Position[];
  achievements: Achievement[];
  researchInterests: ResearchInterest[];
  tags: Tag[];
}

export interface BusinessData extends UserData {
  companyName: string;
  phoneNumber: string;
  location: string;
  industry: string;
  description: string;
  website?: string;
}

export interface AdminData extends UserData {}

export interface ResearchHighlight {
  title: string;
  status: "ONGOING" | "COMPLETED";
}

export interface Education {
  degree: string;
  institution: string;
  passingYear: string;
}

export interface Position {
  title: string;
  institution: string;
  startYear: string;
  endYear?: string;
  current: boolean;
}

export interface Achievement {
  year: string;
  description: string;
}

export type UserResponse = Student | Professor | Business | SuperAdmin;
