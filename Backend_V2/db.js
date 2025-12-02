import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("[DB] Connected to MongoDB"))
  .catch(err => console.error("[DB] Error:", err));

export default mongoose;
