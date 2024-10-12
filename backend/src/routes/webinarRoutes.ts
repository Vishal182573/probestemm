import express from "express";
import * as webinarController from "../controllers/webinarsControllers";

const router = express.Router();

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

router.post("/", async (req, res) => {
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
