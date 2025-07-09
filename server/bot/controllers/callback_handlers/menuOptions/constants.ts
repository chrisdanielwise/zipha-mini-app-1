export const paymentTypes: string[] = [
    "usdt",
    "naira",
    "btc",
    "skrill",
    "erc",
    "foreign_payment",
  ];
  
  export const paymentOptions: string[] = [
    "$10,000 - $49,000",
    "$50,000 - $1 million",
    "mentorship_price_list",
    "one_on_one_price_list",
    "one_month",
    "three_months",
    "six_months",
    "twelve_months",
    "bootcamp_payment",
  ];
  
  export const serviceOptions: string[] = [
    "vip_signal",
    "mentorship",
    "partnership",
    "bootcamp",
    "fund_management",
  ];
  
  export const SubscriptionStatus = {
    EXPIRED: "expired",
    INACTIVE: "inactive",
    ACTIVE: "active",
    PENDING: "pending",
  } as const;
  
  const DAY: number = 24 * 60 * 60 * 1000; // milliseconds in a day
  
  export const EXPIRATION_DATES: { [key: string]: number } = {
    one_month: 30 * DAY,
    three_months: 3 * 30 * DAY,
    six_months: 6 * 30 * DAY,
    twelve_months: 12 * 30 * DAY,
  };
  