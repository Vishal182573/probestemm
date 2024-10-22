import express from "express";
import {
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from "../controllers/businessControllers.ts";

const router = express.Router();

// Get all businesses
router.get("/", getAllBusinesses);

// Get a specific business by ID
router.get("/:id", getBusinessById);

// Update a business
router.put("/:id", updateBusiness);

export default router;
