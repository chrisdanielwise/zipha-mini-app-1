import { Context } from "grammy";

interface NavigationMapEntry {
  navigation: string | ((ctx: Context) => void | Promise<void> | string);
  callback: ((ctx: Context, ...args: any[]) => Promise<void>) | null;
}

export const navigationMap = (
  ctx: Context,
  messageId: number,
  userId: number,
  data: any
): { [key: string]: NavigationMapEntry } => {
  const { oneMonth, threeMonths, sixMonths, oneYear } = data?.vipDiscountPrice || {};

  return {
    "vip_signal": {
      navigation: "Vip Signal",
      callback: null,
    },
    "mentorship": {
      navigation: "Mentorship",
      callback: null,
    },
    "partnership": {
      navigation: "Partnership",
      callback: null,
    },
    "fund_management": {
      navigation: "Fund Management",
      callback: null,
    },
    "broker": {
      navigation: "Broker",
      callback: null,
    },
    "prop_firm": {
      navigation: "Prop Firm",
      callback: null,
    },
    "bootcamp": {
      navigation: "3 Days BootCamp",
      callback: null,
    },
    "bootcamp_payment": {
      navigation: "Pay Fee: $79.99",
      callback: null,
    },
    "$10,000 - $49,000": {
      navigation: "$10,000 - $49,000",
      callback: null,
    },
    "$50,000 - $1 million": {
      navigation: "$50,000 - $1 million",
      callback: null,
    },
    "mentorship_price_list": {
      navigation: "Group Mentorship Fee - $300",
      callback: null,
    },
    "one_on_one_price_list": {
      navigation: "1 - On - 1     Fee - $1100",
      callback: null,
    },
    "vip_report": {
      navigation: "VIP Report",
      callback: null,
    },
    "one_month": {
      navigation: `1 Month - $${oneMonth || 99}`,
      callback: null,
    },
    "three_months": {
      navigation: `3 Months - $${threeMonths || 299}`,
      callback: null,
    },
    "six_months": {
      navigation: `6 Months - $${sixMonths || 599}`,
      callback: null,
    },
    "twelve_months": {
      navigation: `12 Months - $${oneYear || 999}`,
      callback: null,
    },
    "agree_one": {
      navigation: "Agree One $1000",
      callback: null,
    },
    "agree_two": {
      navigation: "Agree Two",
      callback: null,
    },
    "usdt": {
      navigation: "USDT",
      callback: null,
    },
    "naira": {
      navigation: "Naira Payment",
      callback: null,
    },
    "btc": {
      navigation: "BTC",
      callback: null,
    },
    "erc": {
      navigation: "Ethereum Payment",
      callback: null,
    },
    "skrill": {
      navigation: "Skrill Payment",
      callback: null,
    },
    "check_subscription_status": {
      navigation: "Check Subscription Status",
      callback: null,
    },
    "gift_coupon": {
      navigation: "Gift Coupon",
      callback: null,
    },
    "generate_coupon": {
      navigation: "Generate Coupon",
      callback: null,
    },
    "faq": {
      navigation: (ctx: Context): string => {
        return "FAQ";
      },
      callback: null,
    },
    "next_faq": {
      navigation: (ctx: Context): string => {
        return "next_0";
      },
      callback: null,
    },
    "prev_faq": {
      navigation: (ctx: Context): string => {
        return "prev_0";
      },
      callback: null,
    },
    "foreign_payment": {
      navigation: "Foreign Payment",
      callback: null,
    },
    "settings": {
      navigation: "Settings",
      callback: null,
    },
    "nairaPrice": {
      navigation: "nairaprice",
      callback: null,
    },
    "vipDiscountPrice": {
      navigation: "Vip Discount Price",
      callback: null,
    },
    "vipPrice": {
      navigation: "Vip Prices",
      callback: null,
    },
    "generate_code": {
      navigation: "Generate Code",
      callback: null,
    },
    "goback": {
      navigation: "goBack",
      callback: null,
    },
    "mainmenu": {
      navigation: "mainMenu",
      callback: null,
    },
  };
};

export const navigationOptions = {
  // Navigation options configuration
  home: {
    label: "Home",
    action: "navigate_home"
  },
  settings: {
    label: "Settings",
    action: "navigate_settings"
  },
  payment: {
    label: "Payment",
    action: "navigate_payment"
  },
  subscription: {
    label: "Subscription",
    action: "navigate_subscription"
  },
  support: {
    label: "Support",
    action: "navigate_support"
  }
}; 