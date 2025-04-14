import path from "path";
import { extractTextFromFile } from "../extractText";

// Normalizes extracted text to lowercase and removes special characters like "·"
const normalize = (text: string) =>
  text.replace(/[·\r\n]+/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

describe("extractTextFromFile", () => {
  const assetsDir = path.resolve(__dirname, "assets");

  it("extracts text from a valid PDF", async () => {
    const filePath = path.join(assetsDir, "sampleResume.pdf");
    const mimetype = "application/pdf";
    const result = await extractTextFromFile(filePath, mimetype);
    const cleaned = normalize(result);

    expect(cleaned).toContain("marcus peterson");
    expect(cleaned.length).toBeGreaterThan(10);
  });

  it("extracts text from a valid DOCX", async () => {
    const filePath = path.join(assetsDir, "sampleResume.docx");
    const mimetype =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const result = await extractTextFromFile(filePath, mimetype);
    const cleaned = normalize(result);

    expect(cleaned).toContain("marcus peterson");
    expect(cleaned.length).toBeGreaterThan(10);
  });

  it("throws on unsupported MIME type", async () => {
    const filePath = path.join(assetsDir, "corruptFile.xyz");

    await expect(
      extractTextFromFile(filePath, "application/zip")
    ).rejects.toThrow("Unsupported file type");
  });

  it("throws on unreadable/corrupt file", async () => {
    const filePath = path.join(assetsDir, "corruptFile.xyz");
    const mimetype = "application/pdf";

    await expect(extractTextFromFile(filePath, mimetype)).rejects.toThrow();
  });
});

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes("Warning:")) return;
      console.log(msg);
    });
  });
  