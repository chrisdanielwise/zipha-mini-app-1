import { Context } from "grammy";

export async function handlePollAnswer(ctx: Context) {
  try {
    console.log("Poll answer received:", ctx.pollAnswer);
    // Handle poll answer logic here
  } catch (error) {
    console.error("Error handling poll answer:", error);
  }
} 