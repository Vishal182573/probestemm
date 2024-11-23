import express from "express";
import {
  getBusinessById,
  searchBusinesses,
  updateBusiness,
} from "../controllers/businessControllers.ts";

const router = express.Router();

// Get all businesses
router.get("/search", searchBusinesses);

// Get a specific business by ID
router.get("/:id", getBusinessById);

// Update a business
router.put("/:id", updateBusiness);

export default router;
