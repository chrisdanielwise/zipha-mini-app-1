/* eslint-disable react-hooks/rules-of-hooks */
import { Context, session } from "grammy";
// const schedule = require('node-schedule');
import schedule from "node-schedule";
import { getGreybot } from "./setWebhook";
import { Navigation } from "../controllers/navigation/navigationClass";
import { handleChatMember } from "../controllers/callback_handlers/channelHandlers/handleChatMembers/handleChatMembers";
import { handleMessages } from "../controllers/callback_handlers/messageHandler/messageHandler";
import { handleChannelPost } from "../controllers/callback_handlers/channelHandlers/handleChannelPost/handleChannelPost";
import { menuOptionsCallback } from "../controllers/callback_handlers/menuOptions";
import { handlePollAnswer } from "../controllers/callback_handlers/handlePoll/handlePollAnswer";
import { checkSubscription } from "../controllers/callback_handlers/channelHandlers/handleSubscription/checkSubscriptionStatus";

const channelId = Number(process.env.VIP_SIGNAL_ID)
interface SessionData {
  step: string;
}

export async function GreyBotHandler(): Promise<void> {
  // const broadcast = Broadcast()
  const navigation = Navigation.getInstance();

  // Add session middleware
  getGreybot().use(
    session<SessionData, Context>({
      initial: () => ({ step: "idle" }),
    })
  );

  getGreybot().on("chat_member", async (ctx) => {
    await handleChatMember(ctx);
  });

  getGreybot().on("message", (ctx) => handleMessages(ctx));
  getGreybot().on("channel_post", handleChannelPost);
  getGreybot().on("callback_query:data", menuOptionsCallback);
  getGreybot().on("poll_answer", handlePollAnswer);

  // Schedule subscription checks
  schedule.scheduleJob("0 0 0 * * *", async () => {
    console.log("Checking subscription status...");
    await checkSubscription(channelId);
    console.log("Subscription check complete.");
  });

  // Schedule maintenance every Monday at midnight
  schedule.scheduleJob("0 0 0 * * 1", async () => {
    console.log("Performing maintenance...");
    await navigation.performMaintenance(getGreybot());
    console.log("Maintenance complete.");
  });
}