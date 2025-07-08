export const paymentTypes = ["usdt", "naira", "btc", "erc", "skrill"];
export const paymentOptions = ["one_month", "three_months", "six_months", "twelve_months"];
export const serviceOptions = ["vip_signal", "mentorship", "partnership", "fund_management"];

export enum SubscriptionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled"
}

export const EXPIRATION_DATES = {
  one_month: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  three_months: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  six_months: 180 * 24 * 60 * 60 * 1000, // 180 days in milliseconds
  twelve_months: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
}; 