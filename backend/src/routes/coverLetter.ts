// src/routes/coverLetter.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { extractTextFromFile } from "../utils/extractText";
import { getCoverLetter } from "../utils/gptCoverLetter";
import { Request, Response } from "express";

const router = express.Router();

// Same multer config as resume route
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;
    const notes = req.body.notes || "";

    if (!file || !jobDescription) {
      res.status(400).json({ error: "Missing resume or job description" });
      return;
    }

    const filePath = path.resolve(file.path);
    const resumeText = await extractTextFromFile(filePath, file.mimetype);

    // Clean up file
    fs.unlinkSync(filePath);

    const coverLetter = await getCoverLetter(resumeText, jobDescription, notes);

    res.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter generation failed:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

export default router;
