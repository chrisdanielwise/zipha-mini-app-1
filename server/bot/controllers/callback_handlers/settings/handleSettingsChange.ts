import { Context } from "grammy";

export async function handleSettingsChange(ctx: Context): Promise<void> {
  try {
    await ctx.answerCallbackQuery({
      text: "Settings updated successfully!",
      show_alert: true,
    });
  } catch (error) {
    console.error("Error handling settings change:", error);
    await ctx.answerCallbackQuery({
      text: "Failed to update settings. Please try again.",
      show_alert: true,
    });
  }
} 