/*
================================================================================
📁 server/bot/config/errorHandler.ts (NEW - Logic from initBot.ts)
================================================================================
This file contains the logic for sending a detailed error report to the
admin if the bot crashes.
*/
import os from "os";
import process from "process";
import { Bot, BotError, Context, SessionFlavor } from "grammy";
import { MyContext } from "../setup";

const ADMIN_ID = process.env.ADMIN_ID;
const BOT_NAME = process.env.USER_NAME || "Zipha Bot";

// This function now accepts the bot instance with the correct context type
export async function handleBotError(err: unknown, bot: Bot<MyContext>) {
  console.error("❌ A critical error occurred:", err);

  if (!ADMIN_ID) {
    console.error("Admin ID not configured. Cannot send error report.");
    return;
  }

  const error = err instanceof BotError ? err.error : err;
  const ctx = err instanceof BotError ? (err.ctx as MyContext) : undefined;
  const errorMessage = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : "An unknown error occurred.";

  const cpuInfo = `${os.cpus()[0].model} (${os.cpus().length} cores)`;
  const ramInfo = `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`;
  const uptimeSeconds = Math.floor(os.uptime());
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const uptimeInfo = `${days}d ${hours}h ${minutes}m`;

  const systemInfo = `
🚨 **Critical Bot Error on ${BOT_NAME}** 🚨

**Error:**
\`\`\`
${errorMessage}
\`\`\`
${ctx ? `**User:** ${ctx.from?.id} (@${ctx.from?.username})` : ''}

**System Info:**
- **Platform:** ${os.platform()} (${os.arch()})
- **CPU:** ${cpuInfo}
- **RAM:** ${ramInfo}
- **Uptime:** ${uptimeInfo}
- **Node:** ${process.version}
`;

  try {
    // Use the provided bot instance to send the message
    await bot.api.sendMessage(ADMIN_ID, systemInfo, { parse_mode: "Markdown" });
    console.log("✅ Error report sent to admin.");
  } catch (e) {
    console.error("❌ Failed to send error report to admin:", e);
  }
}
