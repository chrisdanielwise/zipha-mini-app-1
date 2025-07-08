import { Navigation } from "../../navigation/navigationClass";
import { handleSelectionConfirmation } from "./selectionConfirmation";
import { Context } from "grammy";
import { EXPIRATION_DATES } from "./constants";
import Coupon from "../../../models/couponClass";
import { userInfoSingletonInstance } from "../../../models/userInfoSingleton";

const couponInstance = Coupon.getInstance();

interface NavigationAction {
  navigation: string | ((...args: any[]) => any);
  callback: any;
}

export async function handleNavigationAction(
  ctx: Context,
  navigationAction: NavigationAction,
  option: string
): Promise<void> {
  try {
    const navigation = Navigation.getInstance();
    if (typeof navigationAction.navigation === "string") {
      await navigation.navigate(ctx, navigationAction.navigation, navigationAction.callback);
      await handleSelectionConfirmation(ctx, option, navigationAction);
    } else if (typeof navigationAction.navigation === "function") {
      if (navigationAction.callback === null) {
        await navigationAction.navigation(ctx, navigationAction.callback);
      } else {
        await navigation.navigate(ctx, navigationAction.navigation(), navigationAction.callback);
      }
    }
    // Rest of your code remains the same
    switch (option) {
      case "one_month":
      case "three_months":
      case "six_months":
      case "twelve_months": {
        // Calculate expiration date separately
        function calculateExpirationDate(option: string): number {
          const currentTimestamp = Date.now();
          const subscriptionPeriod = EXPIRATION_DATES[option as keyof typeof EXPIRATION_DATES];
          return currentTimestamp + subscriptionPeriod;
        }
        // Pre-calculate expiration date when user selects subscription option
        const expirationDate = calculateExpirationDate(option);
            userInfoSingletonInstance.subscribe(option);
    userInfoSingletonInstance.setExpirationDate(expirationDate);
        break;
      }
      case "gift_coupon": {
        await ctx.reply("Please Enter Coupon Code below:");
        await couponInstance.setCouponMessageSet(true);
        break;
      }
      case "one_on_one_price_list":
      case "mentorship_price_list":
      case "$10,000 - $49,000":
      case "$50,000 - $1 million":
      case "bootcamp_payment": {
        userInfoSingletonInstance.subscribe(option);
        break;
      }
    }
  } catch (error) {
    console.error("Error handling navigation action:", error);
  }
} 