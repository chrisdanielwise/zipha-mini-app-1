import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Ensure env vars are loaded first

import { Bot, session } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { connectDB } from "./config/connection";
import { MyContext, SessionData, setupBot } from "./setup";
import { handleBotError } from "./config/erroHandler";
import { settingsClass } from "./controllers/callback_handlers/settings/settingsClass";
import CatchMechanismClass from "./models/catchMechanismClass";
import mongoose from "mongoose";

async function main() {
  console.log("Initializing bot...");

  // 1. Connect to the Database
  await connectDB();

  // 2. Get Bot Token
  const token = process.env.GREY_BOT_API_TOKEN; 
  if (!token) {
    console.error("❌ GREY_BOT_API_TOKEN is not set in your environment variables!");
    process.exit(1); // Exit if no token is found
  }

  // 3. Create and Configure the Bot Instance with the custom context type
  const bot = new Bot<MyContext>(token, {
    client: {
      timeoutSeconds: 10,
    },
  });

  // ✅ ======================================================================
  // ✅ CENTRALIZED INITIALIZATION & MIDDLEWARE
  // ======================================================================

  // Apply session middleware FIRST to add `ctx.session` to the context.
  // This resolves the TypeScript error.
  bot.use(
    session<SessionData, MyContext>({
      initial: () => ({ step: "idle" }),
    })
  );

  // Apply the auto-retry plugin for better network stability
  bot.api.config.use(autoRetry());



  console.log("✅ Bot logic and handlers have been registered.");

  // ✅ ======================================================================
  // ✅ ADD YOUR INITIALIZATION LOGIC HERE
  // ✅ This runs after the bot and DB are ready, but before it starts listening.
  // ✅ ======================================================================
  const settings = settingsClass();
  await settings.getSettings();
  const catchMechanismInstance = CatchMechanismClass.getInstance(mongoose.connection);
  await catchMechanismInstance.initialize();
  console.log("✅ Custom settings and services initialized.");
  // ✅ ======================================================================

    // 4. Register all your bot's logic, commands, and middleware
  setupBot(bot);
 // 5. Set up a global error handler for the bot.
  bot.catch((err) => handleBotError(err, bot));

  // 6. Start the bot using Long Polling
  // This will run forever and fetch updates from Telegram.
  console.log("🚀 Starting bot with long polling...");
  await bot.start();
}

// Run the main function and catch any fatal startup errors
// Run the main function and catch any fatal startup errors
main().catch((err) => {
    handleBotError(err, new Bot(process.env.GREY_BOT_API_TOKEN || ''));
    process.exit(1);
});