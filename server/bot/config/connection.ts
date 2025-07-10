import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";
export async function connectDB(): Promise<{ client: typeof mongoose; db: typeof mongoose.connection }> {
  if (mongoose.connection.readyState >= 1) {
    return { client: mongoose, db: mongoose.connection }; // Already connected
  }

  await mongoose.connect(process.env.MONGODB_URI as string, {
    autoIndex: false,
    bufferCommands: false,
    serverSelectionTimeoutMS: 50000,
    maxPoolSize: Number(process.env.MONGO_POOLSIZE) || 5,
  });

  await handleMongooseConnectionEvents(); // ✅ good for debugging and lifecycle tracking

  return { client: mongoose, db: mongoose.connection };
}

function handleMongooseConnectionEvents(): void {
  mongoose.connection.on("connected", () => console.log("Connected to MongoDB successfully!"));
  mongoose.connection.on("open", () => console.log("MongoDB connection is now open!"));
  mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB. Trying to reconnect..."));
  mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB successfully!"));
  mongoose.connection.on("disconnecting", () => console.log("Disconnecting from MongoDB..."));
  mongoose.connection.on("close", () => console.log("MongoDB connection is now closed."));
}