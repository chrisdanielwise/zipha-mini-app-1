import { Context } from "grammy";
import screenshotStorage from "../../navigation/screenshotStorageClass";
import { paymentTypes, paymentOptions, serviceOptions } from "./constants";

interface NavigationAction {
  navigation: any;
}

export async function handleSelectionConfirmation(
  ctx: Context,
  option: string,
  navigationAction: NavigationAction
): Promise<void> {
  if(!ctx.update?.callback_query){
    throw new Error("Update not found in context")
  }
  const userId = ctx.update.callback_query?.from?.id || 0;
  const selectedOptions = {
    paymentType: paymentTypes.includes(option)
      ? navigationAction.navigation
      : "No payment type selected",
    paymentOption: paymentOptions.includes(option)
      ? navigationAction.navigation
      : "No subscription package selected",
    serviceOption: serviceOptions.includes(option)
      ? navigationAction.navigation
      : "No service option selected",
  };

  async function sendSelectionConfirmation(type: string, selectedOption: string): Promise<void> {
    await ctx.answerCallbackQuery({
      // callback_query_id: ctx.update.callback_query.id,
      text: `${type} selected: ${selectedOption}`,
      show_alert: false,
    });
  }

  if (paymentTypes.includes(option)) {
    await screenshotStorage.setPaymentType(userId, selectedOptions.paymentType);
    await sendSelectionConfirmation("Payment type", selectedOptions.paymentType);
  }

  if (paymentOptions.includes(option)) {
    await screenshotStorage.setPaymentOption(userId, selectedOptions.paymentOption);
    await sendSelectionConfirmation("Subscription package", selectedOptions.paymentOption);
  }

  if (serviceOptions.includes(option)) {
    await screenshotStorage.setServiceOption(userId, selectedOptions.serviceOption);
    await sendSelectionConfirmation("Service option", selectedOptions.serviceOption);
  }
}