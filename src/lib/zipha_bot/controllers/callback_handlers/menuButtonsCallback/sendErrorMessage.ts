import { retryApiCall } from "src/lib/zipha_bot/config/utilities";
import { Context } from "grammy";

export async function sendError(ctx: Context, text: string): Promise<void> {
  if (!ctx.update || !ctx.update.callback_query) {
    console.error("Missing callback query or update context");
    return;
  }

  // const callbackQueryId = ctx.update.callback_query.id;

  try {
    await retryApiCall(() =>
      ctx.answerCallbackQuery({
        // callback_query_id: callbackQueryId,
        text: `An unexpected error occurred. Please try again later:${text}`,
        show_alert: true,
      })
    );
  } catch (error: any) {
    console.error("Error sending error message:", error);
    // Optional: Send error report to administrator
  }
}