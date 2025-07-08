import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from "src/lib/zipha_bot/config/rateLimiter";
import { Greybot } from "src/lib/zipha_bot/config/setWebhook";
import { initializeGreybot } from "src/lib/zipha_bot/config/initBot";
import axios from "axios";


// Ensure the bot token exists
const botToken = process.env.GREY_BOT_API_TOKEN;
if (!botToken) throw new Error("GREY_BOT_API_TOKEN is missing!");
initializeGreybot().catch(console.error);
  // Step 3: Make a request to Next.js API to wake up the server

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("🚀 Incoming Telegram Update:", JSON.stringify(body, null, 2));
    console.log("🚀 Incoming Telegram Update:")

    const rateLimitResponse = await rateLimiterMiddleware(req);
    if (rateLimitResponse) return rateLimitResponse;
    // 🛠️ Manually Handle Update Instead of `webhookCallback`
      // Ensure the bot is initialized before handling updates.
      
    await Greybot.handleUpdate(body);
      
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error processing webhook update:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const webhookUrl = `${process.env.TELEGRAM_URL}/api/zipha_bot`; // Update with your actual domain

    // Call Telegram API to set webhook
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.description || "Failed to set webhook");
    }

    return NextResponse.json({ success: true, message: "Webhook set successfully", result:await initializeGreybot() });
  } catch (error) {
    console.error("❌ Error setting webhook:", error);
    return NextResponse.json({ error: "Failed to set webhook" }, { status: 500 });
  }
}
