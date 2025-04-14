"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const review_1 = __importDefault(require("./routes/review"));
const coverLetter_1 = __importDefault(require("./routes/coverLetter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/review", review_1.default);
app.use("/api/cover-letter", coverLetter_1.default);
exports.default = app;
