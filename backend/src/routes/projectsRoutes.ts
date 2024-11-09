// routes/projectRoutes.ts

import express from "express";
import multer from "multer";
import * as projectController from "../controllers/projectsController";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/project-applications");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

// Project creation routes
router.post(
  "/professor-collaboration",
  projectController.createProfessorProject
);
router.post("/student-opportunity", projectController.createStudentProject);
router.post("/industry-collaboration", projectController.createIndustryProject);

// Get projects routes
router.get("/", projectController.getProjectsByType);
router.get(
  "/:projectId/applications",
  projectController.getProjectApplications
);

// Apply for project route
router.post(
  "/:projectId/apply",
  upload.array("images", 5),
  projectController.applyForProject
);

export default router;
