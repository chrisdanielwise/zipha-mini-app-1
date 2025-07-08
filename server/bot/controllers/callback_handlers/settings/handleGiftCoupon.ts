import { Context } from "grammy";

export async function handleGiftCoupon(ctx: Context) {
  try {
    console.log("Gift coupon request received for user:", ctx.from?.id);
    // Handle gift coupon logic here
    await ctx.reply("Gift coupon processed successfully!");
  } catch (error) {
    console.error("Error handling gift coupon:", error);
    await ctx.reply("Error processing gift coupon");
  }
} 