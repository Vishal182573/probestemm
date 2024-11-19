// routes/projectRoutes.ts

import express from "express";
import multer from "multer";
import * as projectController from "../controllers/projectsController";

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Professor project creation routes
router.post(
  "/professor-collaboration",
  projectController.createProfessorProject
);
router.post("/student-opportunity", projectController.createStudentProject);
router.post("/industry-collaboration", projectController.createIndustryProject);

// Business project creation routes
router.post("/rd-project", projectController.createRDProject);
router.post("/internship", projectController.createInternshipProject);

// Student proposal route
router.post("/student-proposal", projectController.createStudentProposal);

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
