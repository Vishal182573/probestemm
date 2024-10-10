import express from "express";
import {
  studentSignup,
  professorSignup,
  businessSignup,
  adminSignup,
  signin,
  logout,
} from "../controllers/authController";
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
const upload = multer({ storage: storage });

router.post(
  "/student/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await studentSignup(req, res);
    } catch (error) {
      console.error("Error in student signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/professor/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await professorSignup(req, res);
    } catch (error) {
      console.error("Error in professor signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/business/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      await businessSignup(req, res);
    } catch (error) {
      console.error("Error in business signup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/admin/signup", async (req, res) => {
  try {
    await adminSignup(req, res);
  } catch (error) {
    console.error("Error in admin signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    await signin(req, res);
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/logout", async (req, res) => {
  try {
    await logout(req, res);
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
