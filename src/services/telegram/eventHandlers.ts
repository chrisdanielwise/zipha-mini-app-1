// /services/telegram/eventHandlers.ts or your handler location

// import { applyVipDiscount, resetVipDiscount } from "@/services/settings/discountService";
import { Context } from "grammy";
import { applyVipDiscount, resetVipDiscount } from "../settings/discountService";

export async function handleVipDiscountChange(ctx: Context): Promise<void> {
  const callbackFn = ctx.update.callback_query?.data || "";

  const discounts: Record<string, number> = {
    "vip_10_%_off": 0.1,
    "vip_20_%_off": 0.2,
    "vip_30_%_off": 0.3,
    "vip_50_%_off": 0.5,
  };

  if (callbackFn === "vip_reset_all") {
    await resetVipDiscount();
    ctx.answerCallbackQuery({
      text: `Prices reset!`,
      show_alert: true,
    });
  }

  if (discounts[callbackFn]) {
    const discount = discounts[callbackFn];
    await applyVipDiscount(discount);
    ctx.answerCallbackQuery({
      text: `Discount applied: ${discount * 100}% now activated!`,
      show_alert: true,
    });
  }
}