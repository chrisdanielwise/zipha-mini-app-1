import axios from "axios";
import userModel from "../models/schemas/user.model";
import { UserInfo } from "../models/userManagementClass";

// Retry API calls with exponential backoff and randomized delay.
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.log(`API call attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export async function convertToNGN(dollarAmount: number, exchangeData: any): Promise<any> {
  try {
    const ngnRate = exchangeData.conversion_rates?.NGN || 1500;
    const amountInNGN = dollarAmount * ngnRate;
    
    return {
      amountInNGN: Math.round(amountInNGN),
      flexibleExchangeRate: ngnRate.toFixed(2)
    };
  } catch (error) {
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
    const num = wordsToNumbers[word as keyof typeof wordsToNumbers];
    if (typeof num === "number" && num <= 12) {
      return num;
    } else {
      return wordsToNumbers.calculate(word);
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

export async function updateSubscriptionAndExpirationDate(userId: string, subscriptionData: any): Promise<void> {
  // Update subscription logic
  console.log(`Updating subscription for user ${userId}:`, subscriptionData);
}

export function generateCaption(data: any): string {
  // Generate caption logic
  return `Generated caption for ${data}`;
}