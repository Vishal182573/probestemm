// shared/types.ts

// Common Enums
export enum UserRole {
  Student = "student",
  Professor = "professor",
  Business = "business",
  Admin = "admin",
}

// Base Interfaces
export interface CommonFields {
  fullName: string;
  phoneNumber: string;
  location: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  passingYear: string;
}

export interface Achievement {
  id?: string;
  year: string;
  description: string;
}

export interface Position {
  id?: string;
  title: string;
  institution: string;
  startYear: string;
  endYear?: string;
  current: boolean;
}

export interface ResearchHighlight {
  id?: string;
  title: string;
  status: "ONGOING" | "COMPLETED";
}

// Frontend Specific Types
export interface StudentFields extends CommonFields {
  university: string;
  course: string;
  experience?: string;
  education: Education[];
  achievements?: Achievement[];
  researchHighlights?: ResearchHighlight[];
  photoUrl?: string;
}

export interface ProfessorFields extends CommonFields {
  title: string;
  university: string;
  website?: string;
  degree: string;
  department: string;
  position: string;
  researchInterests: string;
  positions?: Position[];
  achievements?: Achievement[];
  photoUrl?: string;
}

export interface BusinessFields extends CommonFields {
  companyName: string;
  industry: string;
  description: string;
  website?: string;
  profileImageUrl?: string;
}

// Backend Specific Types
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
  researchInterests: string;
  positions: Position[];
  achievements: Achievement[];
}

export interface BusinessData extends UserData {
  companyName: string;
  phoneNumber: string;
  location: string;
  industry: string;
  description: string;
  website?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form Data Types for Updates
export interface UpdateStudentFormData
  extends Omit<
    StudentFields,
    "education" | "achievements" | "researchHighlights"
  > {
  education?: string; // JSON string
  achievements?: string; // JSON string
  researchHighlights?: string; // JSON string
  profileImage?: File;
}

export interface UpdateProfessorFormData
  extends Omit<ProfessorFields, "positions" | "achievements"> {
  positions?: string; // JSON string
  achievements?: string; // JSON string
  profileImage?: File;
}

export interface UpdateBusinessFormData
  extends Omit<BusinessFields, "profileImageUrl"> {
  profileImage?: File;
}
