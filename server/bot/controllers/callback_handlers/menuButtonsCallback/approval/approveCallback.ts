import { Context } from "grammy";

export async function approveCallback(ctx: Context) {
  try {
    console.log("Approval callback received for user:", ctx.from?.id);
    // Handle approval logic here
    await ctx.answerCallbackQuery("Approved successfully!");
  } catch (error) {
    console.error("Error handling approval callback:", error);
    await ctx.answerCallbackQuery("Error processing approval");
  }
} 