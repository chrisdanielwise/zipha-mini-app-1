import { Context } from "grammy";

export async function generateCouponHandler(ctx: Context): Promise<void> {
  try {
    await ctx.answerCallbackQuery({
      text: "Coupon generated successfully!",
      show_alert: true,
    });
  } catch (error) {
    console.error("Error generating coupon:", error);
    await ctx.answerCallbackQuery({
      text: "Failed to generate coupon. Please try again.",
      show_alert: true,
    });
  }
} 