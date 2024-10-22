import express from "express";
import {
  getStudentById,
  getStudents,
  createStudent,
  updateStudent,
} from "../controllers/studentControllers";
const router = express.Router();

// Route setup
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);

export default router;
