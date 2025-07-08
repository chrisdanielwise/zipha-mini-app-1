import { Context } from "grammy";
import { settingsClass } from "../settings/settingsClass";
import { navigationMap } from "../../navigation/navigationList";
import { handleNavigationAction } from "./navigationHandler";
import { handleSubscriptionAction } from "./subscriptionHandler";
import { appealCallback } from "../menuButtonsCallback/apeal/appealCallback";
import { cancleCallback } from "../menuButtonsCallback/cancel/cancelCallback";
import { handleOptionAction } from "./optionActionHandler";
import { handleError } from "./errorHandler";
import Coupon from "../../../models/couponClass";

const couponInstance = Coupon.getInstance();

export async function menuOptionsCallback(ctx: Context): Promise<void> {
  if (!ctx.update?.callback_query?.data) {
    throw new Error("Callback query data is missing");
  }
  const option: string = ctx.update.callback_query?.data ?? "";
  
  if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
    throw new Error("Callback query or its message is missing");
  }
  const messageId: number = ctx.update.callback_query.message.message_id;
  if (!ctx.update.callback_query.from) {
    throw new Error("Callback query sender is missing");
  }
  const userId: number = ctx.update.callback_query.from.id;
  
  const settings = settingsClass();
  // Get the corresponding navigation action for the option
  const navigationFunc = navigationMap(ctx, messageId, userId, settings.settings);
  const navigationAction = navigationFunc[option];

  // Handle options that require splitting (e.g., "approve_uniqueId_messageIdCount")
  const [action, uniqueId, messageIdCount] = option.split("_");

  if (navigationAction) {
    await handleNavigationAction(ctx, navigationAction, option);
  }

  try {
    switch (action) {
      case "approve":
        await handleSubscriptionAction(ctx, Number(uniqueId), action);
        ;
        break;
      case "appeal":
        await appealCallback(ctx);
        break;
      case "cancel":
      case "cancleCoupon":
        await cancleCallback(ctx);
        break;
      case "codeList":
        await couponInstance.getActiveCoupon(ctx);
        break;
    }
    await handleOptionAction(ctx, option);
  } catch (error) {
    console.error("Error handling request:", error);
    await handleError(ctx, error);
  }
} 