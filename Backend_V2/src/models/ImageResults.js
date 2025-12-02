import mongoose from "mongoose";

const ImageResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: String,
  result: Object,
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ImageResult", ImageResultSchema);
