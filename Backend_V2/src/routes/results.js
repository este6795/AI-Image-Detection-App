import express from "express";
import ImageResult from "../models/ImageResults.js";

const router = express.Router();

// Fetch results
router.get("/", async (req, res) => {
  try {
    console.log("[RESULTS] Fetching all results...");
    const results = await ImageResult.find().sort({ createdAt: -1 });
    console.log("[RESULTS] Found", results.length, "results");
    res.json(results);
  } catch (err) {
    console.error("[RESULTS] Error fetching results:", err);
    res.status(500).json({ message: "Error fetching results", error: err.message });
  }
});

// Fetch stored images
router.get("/image/:id", async (req, res) => {
  try {
    console.log("[RESULTS] Fetching image ID:", req.params.id);
    const img = await ImageResult.findById(req.params.id);
    if (!img) {
      console.error("[RESULTS] Image not found for ID:", req.params.id);
      return res.status(404).json({ message: "Image not found" });
    }

    console.log("[RESULTS] Image found, size:", img.image.data.length, "bytes");
    res.contentType(img.image.contentType);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(img.image.data);
  } catch (err) {
    console.error("[RESULTS] Error retrieving image:", err);
    res.status(500).json({ message: "Error retrieving image", error: err.message });
  }
});

export default router;
