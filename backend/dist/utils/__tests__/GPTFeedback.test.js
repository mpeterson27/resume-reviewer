"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gptFeedback_1 = require("../gptFeedback");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
describe("getResumeFeedback", () => {
    it("returns structured text + formatting feedback", async () => {
        const dummyText = `
      MARCUS PETERSON
      Denver, Colorado | 352-584-0573 | marcuslukepeterson@gmail.com | linkedin.com/in/mpeterson27/

      EDUCATION
      Fordham University, Gabelli School of Business – MS Global Finance, GPA 3.9
      University of Central Florida – BSBA Finance

      Relevant Coursework: Financial Modeling, Corporate Finance, Financial Data Analysis with Python, Machine Learning for Finance

      PROFESSIONAL EXPERIENCE
      CBIZ MHM, LLC – Manager, Data Analytics Center of Excellence
      • Created automation tools and policies for national analytics efforts
      • Managed servers, help desks, and solution teams
      • Developed CARES Act automation and client intake procedures

      JP Morgan Chase – Relationship Banker
      • Managed 400+ clients and $30M in assets
      • Originated new financial products
      • Focused on compliance and customer solutions

      PROJECTS
      Office Depot SWOT + Financial Plan – Led winning project team
      Strategic Management Competition – School-wide real-world business competition

      SKILLS & CERTIFICATIONS
      • Python, LLM/NLPs, React.js, Power BI, SQL, Excel
      • Azure ML, Computer Vision, Alteryx (Core, Advanced, Server Admin)
      • FINRA Series 6/63, NY Life & Variable Annuities, SIE
      • Professional Scrum Master I

    `;
        // Sample PDF that exists locally for testing
        const samplePdfPath = path_1.default.resolve(__dirname, "./assets/sampleResume.pdf");
        const result = await (0, gptFeedback_1.getResumeFeedback)(dummyText, samplePdfPath);
        expect(typeof result.summary).toBe("string");
        expect(Array.isArray(result.strengths)).toBe(true);
        expect(Array.isArray(result.areas_for_improvement)).toBe(true);
        expect(typeof result.formatting_comments).toBe("string");
    }, 20000); // 20 seconds timeout
});
describe("getTextAnalysis", () => {
    it("throws if GPT returns invalid JSON", async () => {
        const spy = jest.spyOn(gptFeedback_1.openai.chat.completions, "create").mockResolvedValueOnce({
            choices: [{ message: { content: "this is not json" } }],
        }); // we cast to any here to keep things simple
        await expect((0, gptFeedback_1.getTextAnalysis)("fake resume")).rejects.toThrow("Failed to parse GPT response");
        spy.mockRestore();
    });
});
describe("getFormattingFeedback", () => {
    it("returns GPT response based on image", async () => {
        const spy = jest.spyOn(gptFeedback_1.openai.chat.completions, "create").mockResolvedValueOnce({
            choices: [{ message: { content: "Formatting looks clean and professional." } }],
        });
        // create a dummy base64 file
        const dummyImage = Buffer.from("fake image content");
        const fakeImagePath = path_1.default.resolve(__dirname, "fakeImage.png");
        fs_1.default.writeFileSync(fakeImagePath, dummyImage);
        const feedback = await (0, gptFeedback_1.getFormattingFeedback)(fakeImagePath);
        expect(feedback).toMatch(/clean and professional/i);
        fs_1.default.unlinkSync(fakeImagePath); // cleanup
        spy.mockRestore();
    });
});
