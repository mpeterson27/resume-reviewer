"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoverLetter = exports.openai = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const getCoverLetter = async (resumeText, jobDescription, notes) => {
    const prompt = `
Please create a cover letter for me. Do not use the phrase "as advertised". 

Using the resume below, write a personalized cover letter tailored to the provided job description.

If additional notes are provided, factor them into the tone or focus of the letter.

Do not make up any skills, only include skills that are present in the resume or additional notes. 

Try to link of relevant skills in the job decription to the resume, and only state in the cover letter that a skill exists if it is present in the resume.

Respond with only the completed cover letter text, in a professional format that is easy to copy and paste."

Resume:
${resumeText}

Job Description:
${jobDescription}

Additional Notes:
${notes || "None"}
`;
    const chat = await exports.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });
    return chat.choices[0]?.message?.content || "No response from GPT.";
};
exports.getCoverLetter = getCoverLetter;
