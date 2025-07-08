import { Context } from "grammy";

export async function cancleCallback(ctx: Context) {
  try {
    console.log("Cancel callback received for user:", ctx.from?.id);
    // Handle cancel logic here
    await ctx.answerCallbackQuery("Cancelled successfully!");
  } catch (error) {
    console.error("Error handling cancel callback:", error);
    await ctx.answerCallbackQuery("Error processing cancellation");
  }
} 