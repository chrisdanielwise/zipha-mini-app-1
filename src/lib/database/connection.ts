import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function createDatabase(dbName: string) {
  try {
    const connection = await connectToDatabase(dbName);

    // Ensure the database exists by creating an empty "users" collection
    await connection.createCollection("users");

    console.log(`✅ Database '${dbName}' created successfully`);
    return connection;
  } catch (error) {
    console.error("❌ Error creating database:", error);
    throw new Error("Database creation failed");
  }
}

export async function connectToDatabase(dbName: string) {
  try {
    const connection = await mongoose.createConnection(`${MONGODB_URI}/${dbName}`, {
      dbName, // Explicitly specify the database name
    });

    console.log(`✅ Connected to database: ${dbName}`);
    return connection;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw new Error("Database connection failed");
  }
}



