import { Bot, Context, SessionFlavor } from "grammy";
import dotenv from "dotenv";


dotenv.config({ path: ".env.local"}); 

export interface SessionData {
  step: string;
}
interface MyContext extends Context, SessionFlavor<SessionData> {}

const greyBotToken: string = process.env.GREY_BOT_API_TOKEN as string;

export const greybotWebhook: string =  `${process.env.TELEGRAM_URL}/api/zipha_bot`;
export const Greybot = new Bot<MyContext>(greyBotToken);

/**
 * Checks the current webhook and updates it if needed.
 */
export async function setWebhook(): Promise<any> {
    console.log("🔗 Current webhook URL:", greybotWebhook); 
    if (!greyBotToken) { 
      throw new Error('❌ Bot token is missing. Check your .env file.',);
    }
    const currentWebhook = await Greybot.api.getWebhookInfo();
    if (currentWebhook.url !== greybotWebhook) {
      console.log("🔄 Updating webhook...");
      try {
        const result = await Greybot.api.setWebhook(greybotWebhook, {
          allowed_updates: ["chat_member", "message", "callback_query", "channel_post","poll_answer"],
        });
        console.log("✅ Webhook updated successfully.");
        return result;
      } catch (err: any) {
        if (err.error_code === 429) {
          const retryAfter = err.parameters?.retry_after || 1;
          console.warn(`⚠️ Too Many Requests: retrying after ${retryAfter} second(s)...`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          const result = await Greybot.api.setWebhook(greybotWebhook, {
            allowed_updates: ["chat_member", "message", "callback_query", "channel_post"],
          });
          console.log("✅ Webhook updated successfully after retry.");
          return result;
        } else {
          throw err;
        }
      }
    } else {
      console.log("✅ Webhook is already set to the correct URL.");
      return currentWebhook;
    }
  }