import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { RateLimiterMongo } from "rate-limiter-flexible";

const points = 5; // Number of requests allowed
const duration = 1; // Per second
const keyPrefix = "telegram-api-rate-limit";

// ✅ Persistent MongoDB Client to avoid closing after every request
let client: MongoClient;
let db: Db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db("rate-limiter");
  }
  return { client, db };
}

export async function rateLimiterMiddleware(req: NextRequest): Promise<NextResponse | void> {
  const { client, db } = await connectDB();

  const rateLimiter = new RateLimiterMongo({
    storeClient: client,
    dbName: db.databaseName, // ✅ Use the correct database name
    points,
    duration,
    keyPrefix,
  });

  // ✅ Get the user's IP address
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  try {
    await rateLimiter.consume(ip);
  } catch (error) {
    console.error("Rate limiter error:", error);
    return new NextResponse("Too many requests", { status: 429 });
  }
} 