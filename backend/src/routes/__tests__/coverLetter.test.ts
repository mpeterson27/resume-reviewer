import request from "supertest";
import app from "../../app";
import path from "path";

describe("POST /api/cover-letter", () => {
  it("returns a generated cover letter for valid inputs", async () => {
    const res = await request(app)
      .post("/api/cover-letter")
      .field("jobDescription", "Seeking a financial analyst skilled in Alteryx and Power BI")
      .field("notes", "Highlight my data automation experience")
      .attach("resume", path.resolve(__dirname, "../../utils/__tests__/assets/sampleResume.pdf"));

    expect(res.status).toBe(200);
    expect(res.body.coverLetter).toMatch(/(dear|i am writing|i am excited)/i);
  }, 30000);

  it("returns 400 if job description is missing", async () => {
    const res = await request(app)
      .post("/api/cover-letter")
      .attach("resume", path.resolve(__dirname, "../../utils/__tests__/assets/sampleResume.pdf"));

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 30000);

  it("returns 400 if resume is missing", async () => {
    const res = await request(app)
      .post("/api/cover-letter")
      .field("jobDescription", "Some job desc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  }, 30000);
});

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation((msg) => {
    if (typeof msg === "string" && msg.includes("Warning:")) return;
    console.log(msg);
  });
});
