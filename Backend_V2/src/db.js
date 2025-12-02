import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("[DB] Connected to MongoDB"))
  .catch(err => console.error("[DB] Connection error:", err));

export default mongoose;
