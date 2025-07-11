import { Context } from "grammy";
import Coupon from "server/bot/models/couponClass";

const couponInstance = Coupon.getInstance();

export async function generateCouponHandler(ctx: Context): Promise<void> {
  const options = ctx.update?.callback_query?.data;
  if (options === "generate_coupon") {
    const question = "Please select multiple options for combo gifting:";
    const pollOptions: { text: string }[] = [
      { text: "VIP 1 month" },
      { text: "VIP 3 months" },
      { text: "VIP 6 months" },
      { text: "VIP 12 months" },
      { text: "Mentorship 1 on 1" },
      { text: "Mentorship Group" },
    ];
    
    const answer = await ctx.replyWithPoll(question, pollOptions, {
      is_anonymous: false,
      allows_multiple_answers: true,
    });
    await couponInstance.setPollMessageId(answer.message_id);
  }
}
