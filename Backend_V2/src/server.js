import './loadEnv.js';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db.js"; // Database connection (dotenv is loaded above)
import { clearUploadsFolder } from "./middleware/upload.js";

import detectRoutes from "./routes/detect.js";
import resultsRoutes from "./routes/results.js";
import authRoutes from "./routes/auth.js"; // optional if you included auth

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
console.log(`[SERVER] Using FRONTEND_URL=${FRONTEND_URL}`);
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Run startup cleanup of uploads (once) to avoid removing files while an upload is in progress
clearUploadsFolder();

// ROUTE MOUNTING
console.log("[SERVER] Mounting routes...");
app.use("/detect", detectRoutes);
console.log("[SERVER] Route mounted: POST /detect");
app.use("/api/results", resultsRoutes);
console.log("[SERVER] Route mounted: GET /api/results");
app.use("/auth", authRoutes);
console.log("[SERVER] Route mounted: /auth");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
