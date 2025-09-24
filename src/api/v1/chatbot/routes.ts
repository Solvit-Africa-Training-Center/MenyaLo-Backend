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

const chatbotRouter = Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  infoLogger(`Uploads directory created: ${uploadsDir}`, 'routes');
}

// Multer configuration for up to 10 PDF files
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

chatbotRouter.post('/upload', upload.array('files', 10), uploadDocument);

chatbotRouter.post('/query', queryDocument);

chatbotRouter.get('/query-history', getQueryHistory);

chatbotRouter.get('/', getDocuments);

chatbotRouter.put('/:id', updateDocumentById);

chatbotRouter.delete('/:id', deleteDocumentById);

export default chatbotRouter;
