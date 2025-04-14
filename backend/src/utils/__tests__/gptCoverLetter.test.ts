import { getCoverLetter, openai } from "../gptCoverLetter";

describe("getCoverLetter", () => {
  const mockCreate = jest.fn();

  beforeEach(() => {
    mockCreate.mockReset();

    // Override openai.chat.completions.create with our mock
    (openai.chat.completions.create as any) = mockCreate;
  });

  it("returns a cover letter for valid inputs", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Dear Hiring Manager,\nI am excited to apply..." } }],
    });

    const result = await getCoverLetter("resume text", "job description", "");

    expect(result).toMatch(/dear hiring manager/i);
  });

  it("includes notes when provided", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Please emphasize my leadership skills..." } }],
    });

    const result = await getCoverLetter("resume", "job", "emphasize leadership skills");

    expect(result.toLowerCase()).toContain("leadership");
  });

  it("returns fallback message if GPT gives no content", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    const result = await getCoverLetter("resume text", "job desc", "");

    expect(result).toBe("No response from GPT.");
  });
});
