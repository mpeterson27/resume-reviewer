// src/utils/gptFeedback.ts
import { OpenAI } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
const { convert } = require("pdf-poppler");

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const getTextAnalysis = async (text: string) => {
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

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const responseText = chat.choices[0]?.message?.content;

  try {
    return JSON.parse(responseText || "{}");
  } catch (err) {
    throw new Error("Failed to parse GPT response: " + responseText);
  }
};

//Formatting analysis (via image)
export async function getFormattingFeedback(imagePath: string) {
  const prompt = `
You are an expert in resume design and formatting.

Please review the attached resume image and comment on formatting quality, including layout, white space, font usage, alignment, and professional appearance.

Return your feedback as a single string (no JSON needed).
`;

const chat = await openai.chat.completions.create({
  model: "gpt-4o", // Updated model name
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${fs.readFileSync(imagePath).toString("base64")}`,
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
async function convertPdfToImage(pdfPath: string): Promise<string> {
  const outputDir = path.dirname(pdfPath);
  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "resume",
    page: 1, // first page only
  };

  await convert(pdfPath, options);

  const imagePath = path.join(outputDir, "resume-1.png");
  return imagePath;
}

//Final combined feedback
export async function getResumeFeedback(text: string, pdfPath: string) {
  const [textFeedback, imagePath] = await Promise.all([
    getTextAnalysis(text),
    convertPdfToImage(pdfPath),
  ]);

  const formattingComment = await getFormattingFeedback(imagePath);

  return {
    ...textFeedback,
    formatting_comments: formattingComment,
  };
}