// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import cors from "cors";
import FormData from "form-data";
import ImageResult from "./src/models/ImageResults.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------- DATABASE CONNECTION -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("[DB] Connected to MongoDB"))
  .catch(err => console.error("[DB] Connection error:", err));

// ----------------- MULTER SETUP -----------------
const upload = multer({ dest: "uploads/" });

// Optional: Clean uploads folder on startup
function clearUploadsFolder() {
  const folder = "uploads";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  const files = fs.readdirSync(folder);
  for (const file of files) {
    fs.unlinkSync(`${folder}/${file}`);
  }
  console.log("[INIT] Uploads folder cleared");
}
clearUploadsFolder();

// ----------------- API ROUTES -----------------

// POST /detect → Upload image, detect AI, store results
app.post("/detect", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);

    // Prepare API call to Sightengine
    const formData = new FormData();
    formData.append("media", fs.createReadStream(filePath));
    formData.append("models", "genai");
    formData.append("api_user", process.env.API_USER);
    formData.append("api_secret", process.env.API_SECRET);

    // Send image to Sightengine
    const response = await axios.post("https://api.sightengine.com/1.0/check.json", formData, {
      headers: formData.getHeaders(),
    });

    const resultData = response.data;

    // Save to MongoDB (including binary data)
    const newImage = new ImageResult({
      filename: req.file.originalname,
      result: resultData,
      image: {
        data: fileData,
        contentType: req.file.mimetype,
      },
    });

    await newImage.save();

    // Clean up temp file
    fs.unlinkSync(filePath);

    res.json({ success: true, message: "Detection complete", result: resultData });
  } catch (error) {
    console.error("[ERROR] Detection failed:", error);
    res.status(500).json({ success: false, message: "Error processing image" });
  }
});

// GET /api/results → Retrieve all saved results
app.get("/api/results", async (req, res) => {
  try {
    const results = await ImageResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching results" });
  }
});

// GET /api/images/:id → Return image binary
app.get("/api/images/:id", async (req, res) => {
  try {
    const img = await ImageResult.findById(req.params.id);
    if (!img) return res.status(404).send("Image not found");

    res.contentType(img.image.contentType);
    res.send(img.image.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving image" });
  }
});

// ----------------- SERVER START -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
