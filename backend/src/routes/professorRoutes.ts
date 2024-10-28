// src/routes/professorRoutes.ts
import express from "express";
import professorController from "../controllers/professorControllers";

const router = express.Router();

// Public routes
router.get("/", async (req, res) => {
  try {
    await professorController.getProfessors(req, res);
  } catch (error) {
    console.error("Error in getting professors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await professorController.getProfessorById(req, res);
  } catch (error) {
    console.error("Error in getting professor by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected routes (only for professors)
router.put("/:id", async (req, res) => {
  try {
    await professorController.updateProfessor(req, res);
  } catch (error) {
    console.error("Error in updating professor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// super admin approval route
router.put("/:professorId/approval-status", async (req, res) => {
  try {
    await professorController.updateProfessorApprovalStatus(req, res);
  } catch (error) {
    console.error("Error in updating professor approval status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
