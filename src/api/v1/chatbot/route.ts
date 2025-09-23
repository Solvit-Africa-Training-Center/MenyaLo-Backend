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
import { infoLogger } from '../../../utils/logger'; 

const router = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  infoLogger(`Uploads directory created: ${uploadsDir}`, 'routes');
}

const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (recommended)
    files: 1, // Only 1 file per request
  },
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.post('/documents/upload', upload.single('file'), uploadDocument);

router.post('/documents/query', queryDocument);

router.get('/documents/query-history', getQueryHistory);

router.get('/documents', getDocuments);

router.put('/documents/:id', updateDocumentById);

router.delete('/documents/:id', deleteDocumentById);

export default router;
