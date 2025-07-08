import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error("❌ MONGODB_URI environment variable is not defined");
      console.error("❌ Please set MONGODB_URI in your .env.local file");
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB already connected");
      return;
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
} 