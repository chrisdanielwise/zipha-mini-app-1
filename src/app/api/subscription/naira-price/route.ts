import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../server/bot/config/connection";
import { settingsClass } from "../../../../../server/bot/controllers/callback_handlers/settings/settingsClass";
import settingsModel from "../../../../../server/bot/models/settings.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // ✅ Ensure DB connection before anything else
    const nairaPrice = await settingsClass().getSettings();

    return NextResponse.json({
      message: "Fetched Naira and VIP prices",
      nairaPrice
    });
  } catch (error) {
    console.error("GET /subscription/naira-price error:", error);
    return NextResponse.json({ error: "Failed to fetch Naira Price" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, callbackQuery, newValue } = body;

    if (!userId || !callbackQuery || newValue == null) {
      console.warn("Missing fields:", { userId, callbackQuery, newValue });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let updateDoc: any;

    if (callbackQuery === "nairaPrice") {
      updateDoc = { $set: { [`settings.${callbackQuery}`]: Number(newValue) } };
    }else if (/^vip(1|3|6|12)Month$/.test(callbackQuery)) {
      const map: Record<string, string> = {
        vip1Month: "oneMonth",
        vip3Month: "threeMonth",
        vip6Month: "sixMonth",
        vip12Month: "oneYear",
      };
    
      const mappedKey = map[callbackQuery];
    
      updateDoc = {
        $set: {
          [`settings.vipPrice.${mappedKey}`]: Number(newValue),
        },
      };
    } else {
      console.warn("Invalid callbackQuery:", callbackQuery);
      return NextResponse.json({ error: "Invalid callbackQuery" }, { status: 400 });
    }

    const updated = await settingsModel.findOneAndUpdate(
      { userId },
      updateDoc,
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, settings: (updated as any)?.settings });
  } catch (err: any) {
    console.error("Update failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}