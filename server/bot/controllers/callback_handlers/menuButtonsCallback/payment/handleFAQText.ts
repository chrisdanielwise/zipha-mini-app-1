import { Context } from "grammy";

export async function handleFAQText(ctx: Context): Promise<void> {
  try {
    await ctx.answerCallbackQuery({
      text: "FAQ information will be displayed here.",
      show_alert: true,
    });
  } catch (error) {
    console.error("Error handling FAQ text:", error);
    await ctx.answerCallbackQuery({
      text: "Failed to load FAQ. Please try again.",
      show_alert: true,
    });
  }
} 