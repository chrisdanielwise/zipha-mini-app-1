import { Context } from "grammy";

export async function handleBankTransfer(ctx: Context): Promise<void> {
  try {
    await ctx.answerCallbackQuery({
      text: "Bank transfer instructions will be provided here.",
      show_alert: true,
    });
  } catch (error) {
    console.error("Error handling bank transfer:", error);
    await ctx.answerCallbackQuery({
      text: "Failed to process bank transfer. Please try again.",
      show_alert: true,
    });
  }
} 