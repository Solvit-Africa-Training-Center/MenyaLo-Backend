import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { errorLogger } from './logger';
config();

const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;
const cloudinary_api_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: cloudinary_api_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
  secure: true,
});

// Upload file to Cloudinary
export const uploadFile = (
  file: Express.Multer.File,
  folder: string = 'menyalo-images',
): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided for upload'));
      return;
    }

    // Convert buffer to base64 for Cloudinary
    const base64Data = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Data}`;

    cloudinary.uploader.upload(
      dataURI,
      {
        folder,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          errorLogger(error, 'Cloudinary upload error');
          reject(error);
          return;
        }
        if (!result?.secure_url) {
          reject(new Error('No secure URL returned from Cloudinary'));
          return;
        }
        resolve(result.secure_url);
      },
    );
  });

// Upload profile image to Cloudinary
export const uploadProfileFile = (file: Express.Multer.File): Promise<string> =>
  uploadFile(file, 'manyalo-images');

const multerFilterFile = (req: Request, file: Express.Multer.File, cb: FileFilterCallback):void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: multerFilterFile,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB to match our validation
  },
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'menyalo-images',
): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.end(fileBuffer);
  });
