/*
================================================================================
📁 server/bot/setup.ts (MODIFIED - Was greybotHandler.ts)
================================================================================
This file's only job is to define HOW the bot behaves. It takes the bot
instance and attaches all the event listeners (commands, messages, etc.).
*/
import { Bot, Context, session, SessionFlavor } from "grammy";
import schedule from "node-schedule";
import { Navigation } from "./controllers/navigation/navigationClass";
import { handleChatMember } from "./controllers/callback_handlers/channelHandlers/handleChatMembers/handleChatMembers";
import { handleMessages } from "./controllers/callback_handlers/messageHandler/messageHandler";
import { handleChannelPost } from "./controllers/callback_handlers/channelHandlers/handleChannelPost/handleChannelPost";
import { menuOptionsCallback } from "./controllers/callback_handlers/menuOptions";
import { handlePollAnswer } from "./controllers/callback_handlers/handlePoll/handlePollAnswer";
import { checkSubscription } from "./controllers/callback_handlers/channelHandlers/handleSubscription/checkSubscriptionStatus";

// Define a shared context type (can be moved to a types.ts file)
export interface SessionData {
  step: string;
}
export type MyContext = Context & SessionFlavor<SessionData>;
// This function now accepts the bot instance as an argument
export function setupBot(bot: Bot<Context & SessionFlavor<SessionData>>): void {
  const navigation = Navigation.getInstance();
  const channelId = Number(process.env.VIP_SIGNAL_ID);

  // Register all event handlers
  bot.on("chat_member", handleChatMember);
  bot.on("message", handleMessages);
  bot.on("channel_post", handleChannelPost);
  bot.on("callback_query:data", menuOptionsCallback);
  bot.on("poll_answer", handlePollAnswer);

  // Schedule cron jobs (this works perfectly in a stateful environment)
  schedule.scheduleJob("0 0 0 * * *", async () => {
    console.log("Checking subscription status...");
    await checkSubscription(channelId);
    console.log("Subscription check complete.");
  });

  schedule.scheduleJob("0 0 0 * * 1", async () => {
    console.log("Performing maintenance...");
    await navigation.performMaintenance(bot);
    console.log("Maintenance complete.");
  });
}