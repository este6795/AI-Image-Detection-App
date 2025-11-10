import mongoose from "mongoose";

const ImageResultSchema = new mongoose.Schema({
  filename: String,
  result: Object,
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ImageResult", ImageResultSchema);
