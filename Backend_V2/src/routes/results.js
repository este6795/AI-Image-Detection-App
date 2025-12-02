import express from "express";
import ImageResult from "../models/ImageResults.js";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Fetch results for authenticated user (or all if admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log("[RESULTS] Fetching results for user:", req.userId, "isAdmin:", user?.isAdmin);
    
    let results;
    if (user?.isAdmin) {
      // Admins see all results
      results = await ImageResult.find().sort({ createdAt: -1 }).populate('userId', 'email');
      console.log("[RESULTS] Admin view: Found", results.length, "total results");
    } else {
      // Regular users see only their results
      results = await ImageResult.find({ userId: req.userId }).sort({ createdAt: -1 });
      console.log("[RESULTS] User view: Found", results.length, "results for user");
    }
    
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

    // Check authorization
    const user = await User.findById(req.userId);
    if (!user?.isAdmin && img.userId.toString() !== req.userId) {
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

// Delete a result (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Only admins can delete results" });
    }

    const result = await ImageResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    console.log("[RESULTS] Result deleted by admin:", user.email, "- Result ID:", req.params.id);
    res.json({ success: true, message: "Result deleted successfully" });
  } catch (err) {
    console.error("[RESULTS] Error deleting result:", err);
    res.status(500).json({ message: "Error deleting result", error: err.message });
  }
});

export default router;
