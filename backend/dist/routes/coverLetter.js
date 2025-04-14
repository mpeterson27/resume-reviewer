"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/coverLetter.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const extractText_1 = require("../utils/extractText");
const gptCoverLetter_1 = require("../utils/gptCoverLetter");
const router = express_1.default.Router();
// Same multer config as resume route
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/", upload.single("resume"), async (req, res) => {
    try {
        const file = req.file;
        const jobDescription = req.body.jobDescription;
        const notes = req.body.notes || "";
        if (!file || !jobDescription) {
            res.status(400).json({ error: "Missing resume or job description" });
            return;
        }
        const filePath = path_1.default.resolve(file.path);
        const resumeText = await (0, extractText_1.extractTextFromFile)(filePath, file.mimetype);
        // Clean up file
        fs_1.default.unlinkSync(filePath);
        const coverLetter = await (0, gptCoverLetter_1.getCoverLetter)(resumeText, jobDescription, notes);
        res.json({ coverLetter });
    }
    catch (error) {
        console.error("Cover letter generation failed:", error);
        res.status(500).json({ error: "Failed to generate cover letter" });
    }
});
exports.default = router;
