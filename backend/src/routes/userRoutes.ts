import { authMiddleware } from "./../middleware/authMiddleware";
// routes/userRoutes.ts
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import {
  updateStudent,
  updateProfessor,
  updateBusiness,
} from "../controllers/userController";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => `profile_images/${file.originalname}`,
    // folder: "profile_images",
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Update user routes

router.put(
  "/students/:id",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await updateStudent(req, res);
    } catch (error) {
      console.error("Error in updating student:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/professors/:id",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await updateProfessor(req, res);
    } catch (error) {
      console.error("Error in updating professor:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
  "/business/:id",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await updateBusiness(req, res);
    } catch (error) {
      console.error("Error in updating business:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;