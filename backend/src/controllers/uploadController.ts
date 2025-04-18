import type{ Request, Response } from 'express';

// Controller to handle single image upload
const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the uploaded file's details
  return res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path, // URL of the uploaded image
  });
};

// Controller to handle multiple image uploads
const uploadMultipleImages = (req: Request, res: Response) => {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // Type assertion for multiple files (express-multer typings)
  const uploadedFiles = req.files as Express.Multer.File[];

  // Extract image URLs
  const imageUrls = uploadedFiles.map(file => file.path);

  // Return array of image URLs
  return res.status(200).json({
    message: 'Images uploaded successfully',
    imageUrls: imageUrls,
  });
};

export { uploadImage, uploadMultipleImages };