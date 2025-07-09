import { Context } from "grammy";
import { handleSettingsChange } from "../settings/handleSettingsChange";
// import { handleVipDiscountChange } from "../settings/handleVipDiscountChange";
import { handleError } from "./errorHandler";
import { handleVipDiscountChange } from "src/services/telegram/eventHandlers";

export async function handleOptionAction(ctx: Context, option: string): Promise<void> {
  try {
    const vipDiscountOptions: string[] = [
      "vip_10_%_off",
      "vip_20_%_off",
      "vip_30_%_off",
      "vip_50_%_off",
      "vip_reset_all",
    ];
    const settingsOptions: string[] = ["oneMonth", "threeMonth", "sixMonth", "oneYear"];

    if (vipDiscountOptions.includes(option)) {
      await handleVipDiscountChange(ctx);
    } else if (settingsOptions.includes(option)) {
      await handleSettingsChange(ctx);
    }
  } catch (error: any) {
    console.error(`Error handling option ${option}:`, error);
    await handleError(ctx, error);
  }
}