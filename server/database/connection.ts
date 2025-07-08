import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";
import { Greybot } from "../bot/config/setWebhook";

interface DBStats {
  dataSize: number;
  storageSize: number;
  objects: number;
  avgObjSize: number;
}

export async function connectDB(): Promise<{ client: typeof mongoose; db: typeof mongoose.connection }> {
  if (mongoose.connection.readyState >= 1) {
    return { client: mongoose, db: mongoose.connection }; // Already connected
  }

  await mongoose.connect(process.env.DB_CONNECT as string, {
    autoIndex: false,
    bufferCommands: false,
    serverSelectionTimeoutMS: 50000,
    maxPoolSize: Number(process.env.MONGO_POOLSIZE) || 5,
  });

  await handleMongooseConnectionEvents(); // ✅ good for debugging and lifecycle tracking

  return { client: mongoose, db: mongoose.connection };
}

const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // percentage thresholds
const warningMessages = [
  "Database size: 10% full. Monitoring recommended.",
  "Database size: 20% full. Please consider optimizing your data.",
  "Database size: 30% full. Optimization advised.",
  "Database size: 40% full. Action suggested to avoid performance issues.",
  "Database size: 50% full. Attention required to maintain efficiency.",
  "Database size: 60% full. Action required to avoid performance issues.",
  "Database size: 70% full. Critical: please free up space soon.",
  "Database size: 80% full. Critical: please free up space immediately.",
  "Database size: 90% full. Emergency: database is almost full!",
  "Database size: 100% full. Emergency: database is full!",
];

export async function trackDatabaseSize(db: Db): Promise<void> {
  try {
    if (!db) {
      throw new Error("Database instance is not available.");
    }
    const stats = (await db.stats()) as unknown as DBStats;
    const { dataSize, storageSize, objects, avgObjSize } = stats;
    const kilobytes = storageSize / 1024;
    const megabytes = storageSize / 1024 / 1024;
    const percentage = (dataSize / storageSize) * 100;
    const adminChatId = process.env.ADMIN_ID as string;

    const message = `
    <pre>
      Database size: ${dataSize} bytes
      Total storage size: ${storageSize} bytes
      Total storage size: ${kilobytes.toFixed(2)} KB
      Total storage size: ${megabytes.toFixed(2)} MB
      Number of Users: ${objects}
      Average User Data Size: ${avgObjSize} bytes
      Percentage used: ${percentage.toFixed(2)}%
    </pre>
    `;

    console.log(message);

    for (const [index, threshold] of thresholds.entries()) {
      if (percentage >= threshold) {
        console.log(`Threshold exceeded: ${threshold}%`);
        const fullMessage = `<strong>${warningMessages[index]}</strong>\n${message}`;
        await Greybot.api.sendMessage(adminChatId, fullMessage, { parse_mode: "HTML" });
      }
    }
  } catch (error) {
    console.error(`Error tracking database size:`, error);
  }
}

function handleMongooseConnectionEvents(): void {
  mongoose.connection.on("connected", () => console.log("Connected to MongoDB successfully!"));
  mongoose.connection.on("open", () => console.log("MongoDB connection is now open!"));
  mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB. Trying to reconnect..."));
  mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB successfully!"));
  mongoose.connection.on("disconnecting", () => console.log("Disconnecting from MongoDB..."));
  mongoose.connection.on("close", () => console.log("MongoDB connection is now closed."));
} 