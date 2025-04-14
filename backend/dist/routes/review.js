"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/review.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const extractText_1 = require("../utils/extractText");
const gptFeedback_1 = require("../utils/gptFeedback");
const router = express_1.default.Router();
// Setup multer for temporary storage
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "No file uploaded" });
            return Promise.resolve();
        }
        const filePath = path_1.default.resolve(file.path);
        const fileText = await (0, extractText_1.extractTextFromFile)(filePath, file.mimetype);
        // Clean up temp file
        const feedback = await (0, gptFeedback_1.getResumeFeedback)(fileText, filePath);
        fs_1.default.unlinkSync(filePath);
        res.json(feedback);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process resume" });
    }
});
exports.default = router;
