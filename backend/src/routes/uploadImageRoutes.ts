import { Router } from 'express';
import upload from '../middleware/upload';
import { uploadImage } from '../controllers/uploadController';

const router = Router();

// Endpoint to upload an image
router.post('/upload', upload.single('image'), uploadImage);

export default router;
