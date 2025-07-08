import { Context } from "grammy";

export async function checkSubscription(ctx: Context) {
  try {
    console.log("Checking subscription status for user:", ctx.from?.id);
    // Check subscription logic here
    return true; // Return subscription status
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
} 