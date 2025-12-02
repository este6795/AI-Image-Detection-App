import express from "express";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import upload from "../middleware/upload.js";
import ImageResult from "../models/ImageResults.js";
import { deleteTempFile } from "../models/cleanup.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ success: false, error: "No image uploaded" });
  
  try {
    console.log("[DETECT] File received at:", filePath);
    const fileData = fs.readFileSync(filePath);
    console.log("[DETECT] File read, size:", fileData.length, "bytes");

    const formData = new FormData();
    formData.append("media", fs.createReadStream(filePath));
    formData.append("models", "genai");
    formData.append("api_user", process.env.API_USER);
    formData.append("api_secret", process.env.API_SECRET);

    console.log("[DETECT] Sending to Sightengine API...");
    // Send image to Sightengine - include axios limits for large form bodies
    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 30000,
      }
    );

    console.log("[DETECT] API response received:", response.data);

    // Save to MongoDB (using new + save, matching the working version)
    const newImage = new ImageResult({
      filename: req.file.originalname,
      result: response.data,
      image: {
        data: fileData,
        contentType: req.file.mimetype,
      },
    });

    await newImage.save();
    console.log("[DETECT] Image saved to MongoDB, ID:", newImage._id);

    res.json({ success: true, message: "Detection complete", result: response.data });
  } catch (error) {
    // Log full error stack for debugging
    console.error("[ERROR] Detection failed:");
    console.error(error);
    if (error?.response?.data) {
      console.error("[ERROR] API Response data:", error.response.data);
    }

    const errMsg = error?.response?.data?.message || error?.message || "Error processing image";
    res.status(500).json({ success: false, message: errMsg });
  } finally {
    try {
      if (filePath) {
        deleteTempFile(filePath);
      }
    } catch (e) {
      console.error('[CLEANUP] Failed to delete temp file', e);
    }
  }
});

export default router;
