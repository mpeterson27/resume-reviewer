"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextAnalysis = exports.openai = void 0;
exports.getFormattingFeedback = getFormattingFeedback;
exports.getResumeFeedback = getResumeFeedback;
// src/utils/gptFeedback.ts
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { convert } = require("pdf-poppler");
dotenv_1.default.config();
exports.openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const getTextAnalysis = async (text) => {
    const prompt = `
You are a professional resume reviewer.

Analyze the following resume and return ONLY a valid JSON object, with this **exact** format:

{
  "summary": "...",
  "strengths": ["...", "..."],
  "areas_for_improvement": ["...", "..."],
  "recommendations": ["...", "..."],
  "example_changes": ["...", "..."]
}

DO NOT include anything outside the JSON.
DO NOT include explanations, markdown, or commentary.
Just the raw JSON object as described.
Do not provide feedback on formatting. 

Resume:
${text}
`;
    const chat = await exports.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });
    const responseText = chat.choices[0]?.message?.content;
    try {
        return JSON.parse(responseText || "{}");
    }
    catch (err) {
        throw new Error("Failed to parse GPT response: " + responseText);
    }
};
exports.getTextAnalysis = getTextAnalysis;
//Formatting analysis (via image)
async function getFormattingFeedback(imagePath) {
    const prompt = `
You are an expert in resume design and formatting.

Please review the attached resume image and comment on formatting quality, including layout, white space, font usage, alignment, and professional appearance.

Return your feedback as a single string (no JSON needed).
`;
    const chat = await exports.openai.chat.completions.create({
        model: "gpt-4o", // Updated model name
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${fs_1.default.readFileSync(imagePath).toString("base64")}`,
                        },
                    },
                ],
            },
        ],
        temperature: 0.7,
    });
    return chat.choices[0].message?.content || "";
}
//PDF to image conversion
async function convertPdfToImage(pdfPath) {
    const outputDir = path_1.default.dirname(pdfPath);
    const options = {
        format: "png",
        out_dir: outputDir,
        out_prefix: "resume",
        page: 1, // first page only
    };
    await convert(pdfPath, options);
    const imagePath = path_1.default.join(outputDir, "resume-1.png");
    return imagePath;
}
//Final combined feedback
async function getResumeFeedback(text, pdfPath) {
    const [textFeedback, imagePath] = await Promise.all([
        (0, exports.getTextAnalysis)(text),
        convertPdfToImage(pdfPath),
    ]);
    const formattingComment = await getFormattingFeedback(imagePath);
    return {
        ...textFeedback,
        formatting_comments: formattingComment,
    };
}
