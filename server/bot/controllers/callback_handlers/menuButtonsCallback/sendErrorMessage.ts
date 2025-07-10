import { Context } from "grammy";

export async function sendError(ctx: Context, message: string): Promise<void> {
  try {
    await ctx.answerCallbackQuery({
      text: message,
      show_alert: true,
    });
  } catch (error) {
    console.error("Error sending error message:", error);
  }
} 