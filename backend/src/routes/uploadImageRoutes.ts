import { Router } from 'express';
import upload from '../middleware/upload';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController';

const router = Router();

// Endpoint to upload a single image
router.post('/upload', upload.single('image'), uploadImage);

// Endpoint to upload multiple images
router.post('/upload-multiple', upload.array('images'), uploadMultipleImages);

export default router;