// src/utils/extractText.ts
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts text from a file, depending on mimetype.
 */
export const extractTextFromFile = async (
  filePath: string,
  mimetype: string
): Promise<string> => {
  if (mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type: " + mimetype);
};