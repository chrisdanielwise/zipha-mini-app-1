import { Context } from "grammy";

const ALLOWED_PAYMENT_OPTIONS = {
  ONE_MONTH: "one_month",
  THREE_MONTHS: "three_months",
  SIX_MONTHS: "six_months",
  TWELVE_MONTHS: "twelve_months",
  BOOTCAMP_PAYMENT: "bootcamp_payment",
  MENTORSHIP_PRICE_LIST: "mentorship_price_list",
} as const;
export type AllowedOption = "six_months" | "twelve_months" | "bootcamp_payment" | "mentorship_price_list";
export async function getNewInviteLink(
  ctx: Context,
  chatId: number,
  option:  AllowedOption
): Promise<any | null> {
  if (!Object.values(ALLOWED_PAYMENT_OPTIONS).includes(option)) {
    // console.log(`Invalid option: ${option}`);
    return;
  }
  try {
    const chat = await ctx.api.getChat(chatId);
    if (!chat) {
      throw new Error(`Chat not found: ${chatId}`);
    }
    const botMember = await ctx.api.getChatMember(
      chatId,
      Number(process.env.GREYBOT_ID) as number
    );
    if (botMember.status !== "administrator") {
      throw new Error(`Invalid chat or bot permissions: ${chatId}`);
    }
    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expireDateTimestamp = Math.floor(expirationDate.getTime() / 1000);

    const inviteOptions = {
      name: option ?? "",
      member_limit: 1,
      expire_date: expireDateTimestamp,
      creates_join_request: false,
    };
    const newInviteLink = await ctx.api.createChatInviteLink(chatId, inviteOptions);

    return newInviteLink;
  } catch (error:any) {
    // const callbackQueryId = ctx.update.callback_query?.id;
    await ctx.answerCallbackQuery({
      // callback_query_id: callbackQueryId,
      text: "🤦‍♂️ Failed to generate invite link! \n\nPossible reasons:\n\n1. Technical issues\n2. Network connectivity problems\n3. Slow connection\n\nExpect another screenshot from user for retry.\n\nWe're here to help! 👉",
      // parse_mode: "HTML",
      show_alert: true,
    });
    return null;
  }
}