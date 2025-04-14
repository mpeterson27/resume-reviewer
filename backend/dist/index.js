"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const review_1 = __importDefault(require("./routes/review"));
const cors_1 = __importDefault(require("cors"));
const coverLetter_1 = __importDefault(require("./routes/coverLetter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use((0, cors_1.default)());
app.use("/api/review", review_1.default);
app.use("/api/cover-letter", coverLetter_1.default);
app.get("/", (_req, res) => {
    res.send("Resume Reviewer API is running.");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
