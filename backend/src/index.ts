import express from "express";
import dotenv from "dotenv";
import reviewRoutes from "./routes/review";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(cors());
app.use("/api/review", reviewRoutes);

app.get("/", (_req, res) => {
  res.send("Resume Reviewer API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
