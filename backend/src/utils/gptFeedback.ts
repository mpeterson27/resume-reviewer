// src/utils/gptFeedback.ts
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getResumeFeedback = async (text: string) => {
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

Do not include any explanations or notes outside the JSON. Do not provide feedback on formatting. 

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