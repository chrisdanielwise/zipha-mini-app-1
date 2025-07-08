// /app/api/update-fee/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../../../server/bot/config/connection";
import {  settingsClass } from "../../../../../server/bot/controllers/callback_handlers/settings/settingsClass";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, newFee, type } = body;
    
    await connectDB();
    const userID = settingsClass().getUserID()
    if (!id || !newFee || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if(userID !== process.env.USER_ID!) {
        return NextResponse.json({ error: "User is not an admin" }, { status: 400 });

    }
   

    const settings = settingsClass();

    // 👇 Build callbackQuery format: service:<type>:<id>
    const callbackQuery = `service:${type}:${id}`;

    const result = await settings.updateSettings(callbackQuery, Number(newFee));

    return NextResponse.json({ message: "Fee updated", data: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating fee:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
