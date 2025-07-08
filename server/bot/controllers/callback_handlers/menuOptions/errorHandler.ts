import { Context } from "grammy";

export const handleError = async (ctx: Context, error: any, message: string = "An error occurred") => {
  console.error("Error in menu options:", error);
  
  try {
    await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [[{ text: "Go Back", callback_data: "goback" }]]
      }
    });
  } catch (replyError) {
    console.error("Error sending error message:", replyError);
  }
}; 