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
    const fileData = fs.readFileSync(filePath);

    const formData = new FormData();
    formData.append("media", fs.createReadStream(filePath));
    formData.append("models", "genai");
    formData.append("api_user", process.env.API_USER);
    formData.append("api_secret", process.env.API_SECRET);

    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      formData,
      { headers: formData.getHeaders() }
    );

    const newImage = await ImageResult.create({
      filename: req.file.originalname,
      result: response.data,
      image: {
        data: fileData,
        contentType: req.file.mimetype,
      },
    });

    res.json({ success: true, result: response.data });
  } catch (error) {
    console.error("[ERROR] Detection:", error);
    res.status(500).json({ success: false, message: error?.message || "Error during detection" });
  } finally {
    try {
      if (filePath) deleteTempFile(filePath);
    } catch (e) {
      console.error('[CLEANUP] Failed to delete temp file', e);
    }
  }
});

export default router;
