// src/app.ts
import express from "express";
import reviewRoute from "./routes/review";
import coverLetterRoute from "./routes/coverLetter";

const app = express();

app.use(express.json());
app.use("/api/review", reviewRoute);
app.use("/api/cover-letter", coverLetterRoute);

export default app;
