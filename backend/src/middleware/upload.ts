import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// Create Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Specify the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Specify allowed formats
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

export default upload;
