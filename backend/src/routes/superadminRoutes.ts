// src/routes/superAdminRoutes.ts
import express from 'express';
import {
  getAllUsers,
  getWebinars,
  manageWebinar,
} from '../controllers/superAdminControllers';

const router = express.Router();


router.get('/users', getAllUsers);

router.get('/content', getWebinars);
router.put('/webinars/:webinarId', manageWebinar);

export default router;