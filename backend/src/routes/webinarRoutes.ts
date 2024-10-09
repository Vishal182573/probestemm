import { Router } from 'express';

import webinarController from '../controllers/webinarsControllers.ts';

const router = Router();

// Webinar routes
router.get('/webinars', webinarController.getWebinars);
router.get('/webinars/:id', webinarController.getWebinarById);
router.post('/webinars', webinarController.createWebinar);
// router.put('/webinars/:id', webinarController.updateWebinar);
router.get('/webinars/:id/status', webinarController.updateWebinarStatus);

export default router;