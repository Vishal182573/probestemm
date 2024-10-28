import express from "express";
import * as webinarController from "../controllers/webinarsControllers";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => `profile_images/${file.originalname}`,
    // folder: "profile_images",
  },
});

const router = express.Router();
// Use memory storage for handling both Cloudinary and S3 uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const multiUpload = upload.fields([
  { name: "webinarImage", maxCount: 1 },
  { name: "webinarDocument", maxCount: 1 },
]);

// Webinar routes
router.get("/", async (req, res) => {
  try {
    await webinarController.getAllWebinars(req, res);
  } catch (error) {
    console.error("Error in getting webinars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/professor/:professorId", async (req, res) => {
  try {
    await webinarController.getWebinarsByProfessorId(req, res);
  } catch (error) {
    console.error("Error in getting professor's webinars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", multiUpload, async (req, res) => {
  try {
    await webinarController.requestWebinar(req, res);
  } catch (error) {
    console.error("Error in requesting webinar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/:webinarId/status", async (req, res) => {
  try {
    await webinarController.updateWebinarStatus(req, res);
  } catch (error) {
    console.error("Error in updating webinar status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:webinarId/professor-status", async (req, res) => {
  try {
    await webinarController.updateProfessorWebinarStatus(req, res);
  } catch (error) {
    console.error("Error in updating professor's webinar status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
