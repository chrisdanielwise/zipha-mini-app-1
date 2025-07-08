/* eslint-disable react-hooks/rules-of-hooks */
import { Navigation } from "src/lib/zipha_bot/controllers/navigation/navigationClass";
import { checkSubscription } from "src/lib/zipha_bot/controllers/callback_handlers/channelHandlers/handleSubscription/checkSubscriptionStatus";
import { handlePollAnswer } from "src/lib/zipha_bot/controllers/callback_handlers/handlePoll/handlePollAnswer";
import { menuOptionsCallback } from "src/lib/zipha_bot/controllers/callback_handlers/menuOptions";
import { handleChannelPost } from "src/lib/zipha_bot/controllers/callback_handlers/channelHandlers/handleChannelPost/handleChannelPost";
import { handleMessages } from "src/lib/zipha_bot/controllers/callback_handlers/messageHandler/messageHandler";
import { handleChatMember } from "src/lib/zipha_bot/controllers/callback_handlers/channelHandlers/handleChatMembers/handleChatMembers";
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
    await checkSubscription(channelId);
    console.log("Subscription check complete.");
  });

  // Schedule maintenance every Monday at midnight
  schedule.scheduleJob("0 0 0 * * 1", async () => {
    console.log("Performing maintenance...");
    await navigation.performMaintenance(Greybot);
    console.log("Maintenance complete.");
  });
}
