import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db.js"; // Database connection

import detectRoutes from "./routes/detect.js";
import resultsRoutes from "./routes/results.js";
import authRoutes from "./routes/auth.js"; // optional if you included auth

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
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
