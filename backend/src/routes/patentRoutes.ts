import express from "express";
import {
  createPatent,
  getAllPatents,
  getPatentsByProfessorId,
} from "../controllers/patentControllers";
import multer from "multer";

import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 4, // Max 4 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Add error handling middleware for multer
const handleMulterError = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size too large. Maximum size is 5MB",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files. Maximum is 4 files",
      });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Create patent route with proper middleware chain
router.post(
  "/",
  (req, res, next) => {
    upload.array("patentImages", 4)(req, res, (err) => {
      if (err) {
        handleMulterError(err, req, res, next);
      } else {
        next();
      }
    });
  },
  async (req, res) => {
    try {
      console.log("Files received:", req.files);
      console.log("Body received:", req.body);

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          error: "At least one image is required",
        });
      }

      await createPatent(req as any, res);
    } catch (error) {
      console.error("Error in patent creation:", error);
      res.status(500).json({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    await getAllPatents(req, res);
  } catch (error) {
    console.error("Error in getting patents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/professor/:professorId", async (req, res) => {
  try {
    await getPatentsByProfessorId(req, res);
  } catch (error) {
    console.error("Error in getting professor's patents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
