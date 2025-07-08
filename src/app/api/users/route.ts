import { NextResponse } from "next/server";
// import { UserInfo } from "src/lib/zipha_bot/models/userManagementClass";
import { connectDB } from "src/lib/zipha_bot/config/connection";
import userModel from "src/lib/zipha_bot/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const users = await userModel.find(); // .lean() returns plain JS objects
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}
