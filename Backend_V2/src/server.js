import './loadEnv.js';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db.js"; // Database connection (dotenv is loaded above)

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

// ROUTE MOUNTING
app.use("/detect", detectRoutes);
app.use("/api/results", resultsRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
