// src/RAG/route.ts
import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  queryDocument,
  getDocuments,
  updateDocumentById,
  deleteDocumentById
} from "./controller";

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Upload a PDF document
router.post("/documents/upload", upload.single("file"), uploadDocument);

// Query documents / chatbot
router.post("/documents/query", queryDocument);

// Get all documents
router.get("/documents", getDocuments);

// Update document by ID
router.put("/documents/:id", updateDocumentById);

// Delete document by ID
router.delete("/documents/:id", deleteDocumentById);

export default router;
