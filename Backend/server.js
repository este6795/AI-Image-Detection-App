// server.js or routes/detect.js
import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/detect", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("media", fs.createReadStream(req.file.path));
    form.append("models", "genai"); // Sightengine model for AI detection
    form.append("api_user", process.env.API_USER);
    form.append("api_secret", process.env.API_SECRET);

    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      form,
      { headers: form.getHeaders() }
    );

    // Clean up temporary upload
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Image analysis failed" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
