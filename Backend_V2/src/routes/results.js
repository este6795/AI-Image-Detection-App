import express from "express";
import ImageResult from "../models/ImageResults.js";

const router = express.Router();

// Fetch results
router.get("/", async (req, res) => {
  try {
    const results = await ImageResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching results" });
  }
});

// Fetch stored images
router.get("/image/:id", async (req, res) => {
  try {
    const img = await ImageResult.findById(req.params.id);
    if (!img) return res.status(404).send("Image not found");

    res.contentType(img.image.contentType);
    res.send(img.image.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving image" });
  }
});

export default router;
