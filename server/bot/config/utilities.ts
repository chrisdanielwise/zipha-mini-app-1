import axios from "axios";
import userModel from "../models/user.model";
import { UserInfo } from "../models/userManagementClass";

// Retry API calls with exponential backoff and randomized delay.
export async function retryApiCall<T>(
  func: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialRetryDelay?: number;
    maxRetryDelay?: number;
    jitter?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialRetryDelay = 2000,
    maxRetryDelay = 30000,
    jitter = 100,
  } = options;

  let retryDelay = initialRetryDelay;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await func();
    } catch (error: any) {
      if (error.message.includes("Request timed out")) {
        // Retry on timeout error: you might choose to handle this differently.
        return Promise.reject(error);
      } else if (
        error.message.includes("Forbidden: bot can't initiate conversation")
      ) {
        return Promise.reject(error);
      } else {
        console.log("Error occurred, stopping retries...");
        throw error;
      }

      if (attempt < maxRetries) {
        retryDelay = Math.min(maxRetryDelay, retryDelay * 2);
        const randomizedDelay = retryDelay + Math.random() * jitter;
        await new Promise((resolve) => setTimeout(resolve, randomizedDelay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Unreachable code");
}

export async function convertToNGN(
  amount: number,
  data: any
): Promise<{ amountInNGN: number; flexibleExchangeRate: string } | { error: string }> {
  try {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      throw new Error("Data is null, undefined, or empty");
    }

    if (
      !data.conversion_rates ||
      (typeof data.conversion_rates === "object" && Object.keys(data.conversion_rates).length === 0)
    ) {
      throw new Error("conversion_rates is null, undefined, or empty");
    }

    if (!data.conversion_rates.NGN) {
      throw new Error("NGN conversion rate not found in data");
    }

    const ngExchangeRate: number = data.conversion_rates.NGN;
    const totalAmount = amount * ngExchangeRate;
    const amountInNGN = parseInt(totalAmount.toString());
    const flexibleExchangeRate = ngExchangeRate.toFixed(0);
    return { amountInNGN, flexibleExchangeRate };
  } catch (error: any) {
    console.error("Error in convertToNGN:", error);
    return { error: "Failed to convert to NGN" };
  }
}

export async function updateCurrencyExchange(): Promise<any> {
  try {
    const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;
    if (!CURRENCY_API_KEY) {
      throw new Error("CURRENCY_API_KEY is not set");
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`
    );

    if (response.status !== 200) {
      throw new Error(`Failed to retrieve currency data. Status: ${response.status}`);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(
        `Error in updateCurrencyExchange: ${error.response.status} - ${error.response.statusText}`
      );
      return { error: "Failed to retrieve currency data" };
    } else if (error.request) {
      console.error("Error in updateCurrencyExchange: No response received");
      return { error: "Failed to retrieve currency data" };
    } else {
      console.error("Error in updateCurrencyExchange:", error.message);
      return { error: "Failed to retrieve currency data" };
    }
  }
}

export const wordsToNumbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,

  // Calculate numbers beyond 12
  calculate: function (months: string): number {
    let totalMonths = 0;
    const yearRegex = /(\d+) years?/;
    const monthRegex = /(\d+) months?/;

    const yearMatch = months.match(yearRegex);
    const monthMatch = months.match(monthRegex);

    if (yearMatch) {
      totalMonths += parseInt(yearMatch[1]) * 12;
    }
    if (monthMatch) {
      totalMonths += parseInt(monthMatch[1]);
    }
    return totalMonths;
  },

  // Convert word to number
  toNumber: function (word: string): number {
    const num = this[word as keyof typeof this];
    if (typeof num === "number" && num <= 12) {
      return num;
    } else {
      return this.calculate(word);
    }
  },
};

export const numbersToWords = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",

  // Convert numbers beyond 12 to words
  toWord: function (number: number): string {
    if (number <= 12) {
      return this[number as keyof typeof numbersToWords] as string;
    } else {
      const years = Math.floor(number / 12);
      const remainingMonths = number % 12;
      const yearWord = years === 1 ? "year" : "years";
      let monthWord = "";
      const word = numbersToWords[remainingMonths as keyof typeof numbersToWords];
      if (typeof word === "string") {
        monthWord = word;
      } else {
        monthWord = remainingMonths.toString();
      }
      monthWord += remainingMonths === 1 ? " month" : " months";
      

      return `${years} ${yearWord}${monthWord ? " and " + monthWord : ""}`;
    }
  },
};

export async function updateSubscriptionAndExpirationDate(
  userId: number,
  newSubscriptionType: string
): Promise<void> {
  const currentUserInfo = await userModel.findOne({ userId });
  if (!currentUserInfo) {
    throw new Error(`User not found: ${userId}`);
  }

  const currentSubscriptionType: string = currentUserInfo.subscription.type;
  const currentExpirationDate: number = currentUserInfo.subscription.expirationDate;

  // Exclude function keys from the union
  type NumericWordKeys = Exclude<keyof typeof wordsToNumbers, "calculate" | "toNumber">;

  const currentKey = currentSubscriptionType?.split("_")[0] as NumericWordKeys;
  const newKey = newSubscriptionType?.split("_")[0] as NumericWordKeys;

  const currentMonths = wordsToNumbers[currentKey] as number;
  const newMonths = wordsToNumbers[newKey] as number;

  const totalMonths = currentMonths + newMonths;

  const remainingDays = Math.ceil((currentExpirationDate - Date.now()) / (24 * 60 * 60 * 1000));
  const newExpirationDate = Date.now() + (remainingDays + totalMonths * 30) * 24 * 60 * 60 * 1000;

  let subscriptionTypeWord: string;
  if (totalMonths > 12) {
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    subscriptionTypeWord = `${years} year${years > 1 ? "s" : ""} ${remainingMonths > 0 ? "and " + remainingMonths + " month" + (remainingMonths > 1 ? "s" : "") : ""}`.trim();
  } else if (totalMonths === 12) {
    subscriptionTypeWord = "1 year";
  } else {
    subscriptionTypeWord = `${numbersToWords[totalMonths as keyof typeof numbersToWords]}_month${totalMonths > 1 ? "s" : ""}`;
  }
  
  // Update user subscription and expiration date
  await UserInfo.updateUser(userId, {
    subscription: {
      type: subscriptionTypeWord,
      expirationDate: newExpirationDate,
      status: "active",
    },
  });
}

/**
 * Generates a caption for payment verification.
 *
 * @param ctx - Telegram context object.
 * @param serviceOption - Selected service package.
 * @param paymentOption - Selected payment option.
 * @param paymentType - Selected payment type.
 * @param type - If "Free", use gift package formatting.
 * @returns Formatted caption as a string.
 */
export function generateCaption(
  ctx: any,
  serviceOption: string,
  paymentOption: string | null = null,
  paymentType: string | null = null,
  type: string | null = null
): string {
  const fullName = `<code>${ctx.from?.last_name} ${ctx.from?.first_name}</code>`;
  const userName = `<code>@${ctx.from?.username}</code>`;
  const userIdentifier = userName || fullName || "No User Name";
  const serviceInfo = serviceOption ?? "No Service Package selected";

  let paymentInfo: string, paymentTypeInfo: string, appealText: string;

  if (type === "Free") {
    paymentTypeInfo = "Gift Free Package.";
    appealText = "Please verify this Gift Package";
    return `<blockquote>
<strong>${userIdentifier}</strong> 
 
<strong>${serviceInfo}</strong> 

<strong>${paymentTypeInfo}</strong> 
</blockquote>
<i>${appealText}</i>
  `;
  } else {
    paymentInfo = paymentOption ?? "No Payment Option selected";
    paymentTypeInfo = paymentType ?? "No payment Type selected";
    appealText = "Please approve or appeal this payment";

    return `
    <blockquote>
      ${userIdentifier}
      
      ${serviceInfo}
      
      ${paymentInfo}
      
      ${paymentTypeInfo}
    </blockquote>
    <i>${appealText}</i>
  `;
  }
}