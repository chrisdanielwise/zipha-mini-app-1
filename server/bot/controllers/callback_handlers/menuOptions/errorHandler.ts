import { Context } from "grammy";
import { retryApiCall } from "server/bot/config/utilities";

export async function handleError(ctx: Context, error: any): Promise<void> {
  try { 
    if (error.response && error.response.status === 429) {
      await retryApiCall(() =>
        ctx.answerCallbackQuery({
          // callback_query_id: ctx.update.callback_query.id,
          text: "Servers busy! Try again later.",
          show_alert: true,
        })
      );
    } else if (error.response && error.response.status === 400) {
      await retryApiCall(() =>
        ctx.answerCallbackQuery({
          // callback_query_id: ctx.update.callback_query.id,
          text: "Error with request. Try again!",
          show_alert: true,
        })
      );
    } else if (error.message) {
      await retryApiCall(() =>
        ctx.answerCallbackQuery({
          // callback_query_id: ctx.update.callback_query.id,
          text: "Something went wrong. Try again!",
          show_alert: true,
        })
      );
    } else {
      console.error("Unknown error:", error);
    }
  } catch (retryError) {
    console.error("Error handling retry:", retryError);
  }
}