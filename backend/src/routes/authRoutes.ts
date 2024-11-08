// authRoutes.ts
import express from "express";
import {
  studentSignup,
  professorSignup,
  businessSignup,
  adminSignup,
  signin,
  logout,
  resetPassword,
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

// Configure Cloudinary storage with dynamic naming
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate unique filename based on timestamp and original name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}`;

    return {
      folder: "research_interests",
      public_id: filename,
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }],
    };
  },
});

const router = express.Router();

// Configure multer with file filter
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Updated route handlers with better error handling
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
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    // Use indexed field names for research interest images
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `researchInterestImage_${i}`,
      maxCount: 1,
    })),
  ]),
  async (req, res) => {
    try {
      await professorSignup(req as any, res);
    } catch (error) {
      console.error("Error in professor signup:", error);
      res.status(500).json({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
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

router.post("/reset-password",  async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
