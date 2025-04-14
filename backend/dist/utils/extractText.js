"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromFile = void 0;
// src/utils/extractText.ts
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
/**
 * Extracts text from a file, depending on mimetype.
 */
const extractTextFromFile = async (filePath, mimetype) => {
    if (mimetype === "application/pdf") {
        const buffer = fs_1.default.readFileSync(filePath);
        const data = await (0, pdf_parse_1.default)(buffer);
        return data.text;
    }
    if (mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mimetype === "application/msword") {
        const buffer = fs_1.default.readFileSync(filePath);
        const result = await mammoth_1.default.extractRawText({ buffer });
        return result.value;
    }
    throw new Error("Unsupported file type: " + mimetype);
};
exports.extractTextFromFile = extractTextFromFile;
