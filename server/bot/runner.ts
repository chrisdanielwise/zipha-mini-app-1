// server/bot/runner.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Bot, session } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { MyContext, SessionData, setupBot } from "./setup";
import { handleBotError } from "./config/erroHandler";
import { initializeGreybot, getGreybot } from "./config/initBot"; //

async function main() {
  console.log("Initializing bot...");

  // Call initializeGreybot to handle all core initializations:
  // - Connect to the database.
  // - Initialize the bot instance (getGreybot().init()).
  // - Set the webhook (via setWebhook() inside initializeGreybot()).
  // - Load initial settings and catch mechanism.
  await initializeGreybot(); //

  // Get the single bot instance that has been initialized by initializeGreybot.
  const bot = getGreybot(); //

  // Basic check for bot token (should ideally be handled by getGreybot internally too)
  const token = process.env.GREY_BOT_API_TOKEN;
  if (!token) {
    console.error("❌ GREY_BOT_API_TOKEN is not set in your environment variables!");
    process.exit(1);
  }

  // Apply session middleware.
  // Note: bot.api.config.use(autoRetry()) is already handled inside getGreybot().
  bot.use(
    session<SessionData, MyContext>({
      initial: () => ({ step: "idle" }),
    })
  );

  console.log("✅ Bot logic and handlers have been registered.");

  // Register all your bot's logic, commands, and middleware.
  setupBot(bot); //
  
  // Set up a global error handler for the bot.
  bot.catch((err) => handleBotError(err, bot)); //

  // Start the bot. If webhook is correctly set by initializeGreybot,
  // this will allow the bot to receive updates via the webhook URL.
  console.log("🚀 Bot is now running and listening for updates via webhook."); // Corrected log message
  await bot.start();
}

// Run the main function and catch any fatal startup errors
main().catch((err) => {
    // Pass the initialized bot for error handling.
    handleBotError(err, getGreybot()); //
    process.exit(1);
});