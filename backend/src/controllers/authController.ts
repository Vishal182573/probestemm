import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary";
import type {
  StudentData,
  ProfessorData,
  BusinessData,
  AdminData,
  UserRole,
} from "../types/auth";

const prisma = new PrismaClient();

interface FileRequest extends Request {
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

const generateToken = (id: string, role: UserRole) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

const categories = {
  "Physics": [
    "Classical Mechanics",
    "Electromagnetism",
    "Thermodynamics",
    "Quantum Mechanics",
    "Relativity",
  ],
  "Chemistry": [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Physical Chemistry",
    "Analytical Chemistry",
  ],
  "Biology": [
    "Molecular Biology",
    "Cell Biology",
    "Ecology",
    "Evolutionary Biology",
  ],
  "Earth Sciences": [
    "Geology",
    "Meteorology",
    "Oceanography",
    "Natural Hazards and Risk Assessment",
    "Hydrology",
  ],
  "Space Science": [
    "Astronomy",
    "Astrophysics",
    "Planetary Science",
    "Space Exploration",
    "Astrobiology",
    "Space Weather",
    "Space Policy and Law",
  ],
  "Technology": [
    "Artificial Intelligence & Machine Learning",
    "Robotics & Automation",
    "Cybersecurity",
    "Information Technology",
    "Communication Technology",
    "Biotechnology",
    "Nanotechnology",
    "Energy Technology",
  ],
  "Engineering": [
    "Mechanical Engineering",
    "Electrical & Electronics Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Computer Science Engineering",
    "Biomedical Engineering",
    "Industrial & Manufacturing Engineering",
    "Aerospace Engineering",
    "Environmental Engineering",
    "Agricultural Engineering",
    "Marine & Ocean Engineering",
    "Data Science Engineering",
  ],
  "Pure Mathematics": [
    "Algebra",
    "Calculus",
    "Geometry",
    "Number Theory",
    "Analysis",
    "Topology",
    "Graph Theory",
  ],
  "Applied Mathematics": [
    "Probability and Statistics",
    "Operations Research",
    "Numerical Analysis",
    "Mathematical Modelling",
    "Data Science",
    "Economics and Computation",
    "Financial Mathematics",
    "Game Theory",
  ],
} as const;

const checkEmailAcrossRoles = async (email: string) => {
  const [student, professor, business] = await Promise.all([
    prisma.student.findUnique({ where: { email } }),
    prisma.professor.findUnique({ where: { email } }),
    prisma.business.findUnique({ where: { email } })
  ]);

  return {
    isRegistered: !!(student || professor || business),
    existingRole: student ? 'student' : 
                  professor ? 'professor' : 
                  business ? 'business' : 
                  null
  };
};

export const studentSignup = async (req: Request, res: Response) => {
  try {
    const userData: StudentData = req.body;
    const file = req.file;

    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await prisma.student.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const emailCheck = await checkEmailAcrossRoles(userData.email);
    if (emailCheck.isRegistered) {
      return res.status(400).json({ 
        error: `Email already registered with ${emailCheck.existingRole} role` 
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let imageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url;
    }

    let idCard = "";
    if (userData.idCard) {
      const result = await cloudinary.uploader.upload(userData.idCard);
      idCard = result.secure_url;
    }

    // Safely parse JSON strings or use arrays directly
    const education = userData.education
      ? Array.isArray(userData.education)
        ? userData.education
        : JSON.parse(userData.education)
      : [];

    const achievements = userData.achievements
      ? Array.isArray(userData.achievements)
        ? userData.achievements
        : JSON.parse(userData.achievements)
      : [];

    const user = await prisma.student.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        imageUrl,
        idCard,
        university: userData.university,
        course: userData.course,
        experience: userData.experience,
        education: {
          create: education,
        },
        achievements: {
          create: achievements,
        },
      },
    });

    const token = jwt.sign(
      { id: user.id, role: "student" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({ user, token, role: "student" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const professorSignup = async (req: FileRequest, res: Response) => {
  try {
    const userData: ProfessorData = req.body;
    const files = req.files || {};

    // Validate required fields
    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check for existing user
    const existingUser = await prisma.professor.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const emailCheck = await checkEmailAcrossRoles(userData.email);
    if (emailCheck.isRegistered) {
      return res.status(400).json({ 
        error: `Email already registered with ${emailCheck.existingRole} role` 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Parse JSON strings from form data
    let researchInterests = [];
    let tags = [];
    let positions = [];
    let achievements = [];

    try {
      researchInterests = userData.researchInterests
        ? Array.isArray(userData.researchInterests)
          ? userData.researchInterests
          : JSON.parse(userData.researchInterests)
        : [];

      tags = userData.tags
        ? Array.isArray(userData.tags)
          ? userData.tags
          : JSON.parse(userData.tags)
        : [];

      positions = userData.positions
        ? Array.isArray(userData.positions)
          ? userData.positions
          : JSON.parse(userData.positions)
        : [];

      achievements = userData.achievements
        ? Array.isArray(userData.achievements)
          ? userData.achievements
          : JSON.parse(userData.achievements)
        : [];
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON data provided" });
    }

    // Process research interests and their images
    const processedInterests = await Promise.all(
      researchInterests.map(async (interest: any, index: number) => {
        const imageFile = files[`researchInterestImage_${index}`]?.[0];
        let imageUrl = "";

        if (imageFile) {
          try {
            const result = await cloudinary.uploader.upload(imageFile.path);
            imageUrl = result.secure_url;
          } catch (error) {
            console.error(
              `Error uploading image for research interest ${index}:`,
              error
            );
          }
        }

        return {
          title: interest.title,
          description: interest.description || "",
          imageUrl: imageUrl,
        };
      })
    );

    let idCard = "";

    if (userData.idCard) {
      const result = await cloudinary.uploader.upload(userData.idCard);
      idCard = result.secure_url;
    }

    // Create professor in database
    const user = await prisma.professor.create({
      data: {
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        bio: userData.bio || "",
        googleScholar: userData.googleScholar || "",
        phoneNumber: userData.phoneNumber || "",
        idCard,
        location: userData.location || "",
        title: userData.title || "",
        university: userData.university || "",
        website: userData.website || "",
        degree: userData.degree || "",
        department: userData.department || "",
        position: userData.position || "",
        isApproved: false,
        researchInterests: {
          create: processedInterests.map((interest) => ({
            title: interest.title,
            description: interest.description,
            imageUrl: interest.imageUrl,
          })),
        },
        tags: {
          create: tags.map((tag: { category: any; subcategory: any }) => ({
            category: tag.category,
            subcategory: tag.subcategory,
          })),
        },
        positions: {
          create: positions.map(
            (position: {
              title: any;
              institution: any;
              startYear: any;
              endYear: any;
              current: any;
            }) => ({
              title: position.title,
              institution: position.institution,
              startYear: position.startYear,
              endYear: position.endYear,
              current: position.current,
            })
          ),
        },
        achievements: {
          create: achievements.map(
            (achievement: { year: any; description: any }) => ({
              year: achievement.year,
              description: achievement.description,
            })
          ),
        },
      },
      include: {
        researchInterests: true,
        tags: true,
        positions: true,
        achievements: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: "professor" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Return success response
    res.status(201).json({
      user,
      token,
      role: "professor",
      message: "Account created successfully. Waiting for admin approval.",
    });
  } catch (error) {
    console.error("Professor signup error:", error);
    res.status(500).json({
      error: "Error creating professor account",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
export const businessSignup = async (req: Request, res: Response) => {
  try {
    const userData: BusinessData = req.body;
    const file = req.file;

    // Check if email exists in the request body
    if (!userData.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await prisma.business.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const emailCheck = await checkEmailAcrossRoles(userData.email);
    if (emailCheck.isRegistered) {
      return res.status(400).json({ 
        error: `Email already registered with ${emailCheck.existingRole} role` 
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let profileImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      profileImageUrl = result.secure_url;
    }

    let idCard = "";
    if (userData.idCard) {
      const result = await cloudinary.uploader.upload(userData.idCard);
      idCard = result.secure_url;
    }

    const user = await prisma.business.create({
      data: {
        companyName: userData.companyName,
        email: userData.email,
        idCard,
        password: hashedPassword,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
        industry: userData.industry,
        description: userData.description,
        website: userData.website,
        profileImageUrl,
      },
    });

    const token = generateToken(user.id, "business");

    res.status(201).json({ user, token, role: "business" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};
export const adminSignup = async (req: Request, res: Response) => {
  try {
    const userData: AdminData = req.body;

    const existingUser = await prisma.superAdmin.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.superAdmin.create({
      data: {
        name: userData.fullName,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id, "admin");

    res.status(201).json({ user, token, role: "superAdmin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      role,
    }: { email: string; password: string; role: UserRole } = req.body;

    let user;
    switch (role) {
      case "student":
        user = await prisma.student.findUnique({ where: { email } });
        break;
      case "professor":
        user = await prisma.professor.findUnique({ where: { email } });
        break;
      case "business":
        user = await prisma.business.findUnique({ where: { email } });
        break;
      case "admin":
        user = await prisma.superAdmin.findUnique({ where: { email } });
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id, role);

    res.json({ user, token, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { userType, email, newPassword } = req.body;

    let user;
    switch (userType) {
      case "student":
        user = await prisma.student.findUnique({ where: { email } });
        break;
      case "professor":
        user = await prisma.professor.findUnique({ where: { email } });
        break;
      case "business":
        user = await prisma.business.findUnique({ where: { email } });
        break;
      case "admin":
        user = await prisma.superAdmin.findUnique({ where: { email } });
        break;
      default:
        return res.status(400).json({ error: "Invalid user type" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    switch (userType) {
      case "student":
        await prisma.student.update({
          where: { email },
          data: { password: hashedPassword },
        });
        break;
      case "professor":
        await prisma.professor.update({
          where: { email },
          data: { password: hashedPassword },
        });
        break;
      case "business":
        await prisma.business.update({
          where: { email },
          data: { password: hashedPassword },
        });
        break;
      case "admin":
        await prisma.superAdmin.update({
          where: { email },
          data: { password: hashedPassword },
        });
        break;
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkEmailExistence = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailCheck = await checkEmailAcrossRoles(email);

    if (emailCheck.isRegistered) {
      return res.status(200).json({ 
        exists: true, 
        role: emailCheck.existingRole 
      });
    }

    return res.status(200).json({ 
      exists: false, 
      role: null 
    });
  } catch (error) {
    console.error("Error checking email existence:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logUserAccess = async (req: Request, res: Response) => {
  try {
    const { emailId} = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || 'Unknown';
    console.log(ipAddress);

    // Validate required fields
    if (!emailId) {
      return res.status(400).json({ error: "Email and Full Name are required" });
    }

    // Create user access log entry
    const userAccess = await prisma.userAccess.create({
      data: {
        emailId,
        fullName:"",
        ipAddress
      }
    });

    res.status(201).json({ 
      message: "User access logged successfully", 
      accessLog: userAccess 
    });
  } catch (error) {
    console.error("Error logging user access:", error);
    res.status(500).json({ error: "Failed to log user access" });
  }
};