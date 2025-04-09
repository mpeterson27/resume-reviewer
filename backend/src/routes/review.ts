// src/routes/review.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { extractTextFromFile } from "../utils/extractText";
import { getResumeFeedback } from "../utils/gptFeedback";
import { Request, Response } from "express";

const router = express.Router();

// Setup multer for temporary storage
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return Promise.resolve();
    }

    const filePath = path.resolve(file.path);
    const fileText = await extractTextFromFile(filePath, file.mimetype);

    // Clean up temp file
    fs.unlinkSync(filePath);

    const feedback = await getResumeFeedback(fileText);

    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

export default router;
