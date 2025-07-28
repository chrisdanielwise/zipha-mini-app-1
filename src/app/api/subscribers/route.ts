import { NextResponse } from "next/server";
import { connectDB } from "../../../../server/bot/config/connection";
import userModel from "../../../../server/bot/models/user.model";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch only users with active or pending subscriptions (inside subscription object)
    // const subscribers = await userModel.find({
    //   "subscription.status": { $in: ["active", "pending"] }
    // }).sort({ createdAt: -1 }); // Sort by newest first
    
    // Fetch only users with active or pending subscriptions (inside subscription object)
    const subscribers = await userModel.find().sort({ createdAt: -1 }); // Sort by newest first
    return NextResponse.json({ 
      success: true, 
      subscribers,
      count: subscribers.length 
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch subscribers" 
    }, { status: 500 });
  }
} 