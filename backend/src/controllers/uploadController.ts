import type { Request, Response } from 'express';

// Controller to handle image upload
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

export { uploadImage };
