import express from "express";
import ImageResult from "../models/ImageResults.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Fetch results for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("[RESULTS] Fetching results for user:", req.userId);
    const results = await ImageResult.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log("[RESULTS] Found", results.length, "results for user");
    res.json(results);
  } catch (err) {
    console.error("[RESULTS] Error fetching results:", err);
    res.status(500).json({ message: "Error fetching results", error: err.message });
  }
});

// Fetch stored images
router.get("/image/:id", authMiddleware, async (req, res) => {
  try {
    console.log("[RESULTS] Fetching image ID:", req.params.id, "for user:", req.userId);
    const img = await ImageResult.findById(req.params.id);
    
    if (!img) {
      console.error("[RESULTS] Image not found for ID:", req.params.id);
      return res.status(404).json({ message: "Image not found" });
    }

    // Verify the image belongs to the authenticated user
    if (img.userId.toString() !== req.userId) {
      console.error("[RESULTS] User not authorized to access this image");
      return res.status(403).json({ message: "Not authorized to access this image" });
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
