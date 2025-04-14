import request from "supertest";
import app from "../../app";
import path from "path";

describe("POST /api/review", () => {
  it("returns resume feedback JSON for valid PDF", async () => {
    const res = await request(app)
      .post("/api/review")
      .attach("file", path.resolve(__dirname, "../../utils/__tests__/assets/sampleResume.pdf"));

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.formatting_comments).toMatch(/(professional|issue with the image|blank)/i);
  },30000);

  it("returns 400 if no file uploaded", async () => {
    const res = await request(app).post("/api/review");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  },30000);
});

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes("Warning:")) return;
      console.log(msg);
    });
  });
  
