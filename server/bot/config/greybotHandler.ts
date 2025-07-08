/* eslint-disable react-hooks/rules-of-hooks */
import { Navigation } from "../controllers/navigation/navigationClass";
import { checkSubscription } from "../controllers/callback_handlers/channelHandlers/handleSubscription/checkSubscriptionStatus";
import { handlePollAnswer } from "../controllers/callback_handlers/handlePoll/handlePollAnswer";
import { menuOptionsCallback } from "../controllers/callback_handlers/menuOptions";
import { handleChannelPost } from "../controllers/callback_handlers/channelHandlers/handleChannelPost/handleChannelPost";
import { handleMessages } from "../controllers/callback_handlers/messageHandler/messageHandler";
import { handleChatMember } from "../controllers/callback_handlers/channelHandlers/handleChatMembers/handleChatMembers";
import { Context, session } from "grammy";
// const schedule = require('node-schedule');
import schedule from "node-schedule";
import { Greybot } from "./setWebhook";

const channelId = Number(process.env.VIP_SIGNAL_ID)

interface SessionData {
  step: string;
}

export async function GreyBotHandler(): Promise<void> {
  // const broadcast = Broadcast()
  const navigation = Navigation.getInstance();

  // Add session middleware
  Greybot.use(
    session<SessionData, Context>({
      initial: () => ({ step: "idle" }),
    })
  );

  Greybot.on("chat_member", async (ctx) => {
    await handleChatMember(ctx);
  });

  Greybot.on("message", (ctx) => handleMessages(ctx));
  Greybot.on("channel_post", handleChannelPost);
  Greybot.on("callback_query:data", menuOptionsCallback);
  Greybot.on("poll_answer", handlePollAnswer);

  // Schedule subscription checks
  schedule.scheduleJob("0 0 0 * * *", async () => {
    console.log("Checking subscription status...");
    // TODO: Fetch users from the channel and check each subscription
    // Example: for (const ctx of userContexts) { await checkSubscription(ctx); }
    console.warn("checkSubscription expects a Context object, not a channelId. Please implement logic to fetch user contexts and call checkSubscription for each.");
    console.log("Subscription check complete.");
  });

  // Schedule maintenance every Monday at midnight
  schedule.scheduleJob("0 0 0 * * 1", async () => {
    console.log("Performing maintenance...");
    await navigation.performMaintenance(Greybot);
    console.log("Maintenance complete.");
  });
} 