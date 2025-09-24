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

const chatBotRoutes = Router();

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

chatBotRoutes.post('/upload', upload.single('file'), uploadDocument);

chatBotRoutes.post('/query', queryDocument);

chatBotRoutes.get('/query-history', getQueryHistory);

chatBotRoutes.get('/', getDocuments);

chatBotRoutes.put('/:id', updateDocumentById);

chatBotRoutes.delete('/:id', deleteDocumentById);

export default chatBotRoutes;
