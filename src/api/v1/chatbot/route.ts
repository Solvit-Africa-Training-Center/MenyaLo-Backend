import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  uploadDocument,
  queryDocument,
  getDocuments,
  updateDocumentById,
  deleteDocumentById,
  getQueryHistory,
} from './controller';
import { infoLogger } from '../../../utils/logger'; // Import your logger

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  infoLogger(`Uploads directory created: ${uploadsDir}`, 'routes');
}

// Configure multer for file uploads with better settings
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (recommended)
    files: 1, // Only 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Upload a PDF document
router.post('/documents/upload', upload.single('file'), uploadDocument);

// Query documents / chatbot
router.post('/documents/query', queryDocument);

// Query-history
router.get('/query-history', getQueryHistory);

// Get all documents
router.get('/documents', getDocuments);

// Update document by ID
router.put('/documents/:id', updateDocumentById);

// Delete document by ID
router.delete('/documents/:id', deleteDocumentById);

export default router;