// ==================== server.js ====================
import express from "express";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ImageResult from "./src/models/ImageResults.js";
import cors from "cors";
import { clearUploadsFolder } from "./src/models/cleanup.js";

//Clean up any tempory files on server start
clearUploadsFolder();

dotenv.config();

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 5000;

// ==================== MongoDB Connection ====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("connected", () => console.log("📡 MongoDB connected successfully"));
mongoose.connection.on("error", (err) => console.error("⚠️ MongoDB error:", err));

// ==================== Middleware ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Routes ====================

// POST /detect - Analyze image and store results
app.post("/detect", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("media", fs.createReadStream(req.file.path));
    form.append("models", "genai");
    form.append("api_user", process.env.API_USER);
    form.append("api_secret", process.env.API_SECRET);

    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      form,
      { headers: form.getHeaders() }
    );

    // Save result to MongoDB
    const newImage = new ImageResult({
      fileName: req.file.originalname,
      result: response.data,
    });

    await newImage.save();
    console.log("✅ Image saved to MongoDB:", newImage._id);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Analysis complete and saved to database",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Error analyzing image:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Image analysis failed" });
  } 
});

// GET /history - Retrieve previous uploads
app.get("/history", async (req, res) => {
  try {
    const results = await ImageResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
