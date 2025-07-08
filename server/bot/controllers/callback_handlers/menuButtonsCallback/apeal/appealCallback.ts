import { Context } from "grammy";

export async function appealCallback(ctx: Context) {
  try {
    console.log("Appeal callback received for user:", ctx.from?.id);
    // Handle appeal logic here
    await ctx.answerCallbackQuery("Appeal submitted successfully!");
  } catch (error) {
    console.error("Error handling appeal callback:", error);
    await ctx.answerCallbackQuery("Error processing appeal");
  }
} 