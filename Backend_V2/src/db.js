import mongoose from "mongoose";

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error('[DB] Error: process.env.MONGO_URI is not set. Please add a valid MongoDB connection string to your .env file.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("[DB] Connected to MongoDB"))
  .catch(err => {
    console.error("[DB] Connection error:", err);
    process.exit(1);
  });

export default mongoose;
