// routes/notificationRoutes.js

import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/:userType/:userId", getNotifications);
router.patch("/:notificationId/read", markNotificationAsRead);

export default router;
