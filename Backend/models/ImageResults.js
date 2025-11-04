import mongoose from "mongoose";

const ImageResultSchema = new mongoose.Schema({
  fileName: String,
  result: Object, // raw API response
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ImageResult", ImageResultSchema);
