import { Context } from "grammy";
import { AllowedOption } from "./getNewInviteLink";

export type PaymentParams = [
  Context,
  number,  // screenshotUserId
  AllowedOption,  // subscriptionType
  number,  // MENTORSHIP_CHANNEL_ID
  number,  // channelId
  string,  // googleDriveLink
  boolean, // isActive
  boolean  // isExpired
];

export const packageHandler = {
  Generic: async (...params: PaymentParams) => {
    const [ctx, uniqueId, subscriptionType, mentorshipChannelId, channelId, googleDriveLink, isActive, isExpired] = params;
    
    try {
      await ctx.answerCallbackQuery({
        text: "Generic package processed successfully!",
        show_alert: true,
      });
    } catch (error) {
      console.error("Error in Generic package handler:", error);
    }
  },

  Gift: async (...params: PaymentParams) => {
    const [ctx, uniqueId, subscriptionType, mentorshipChannelId, channelId, googleDriveLink, isActive, isExpired] = params;
    
    try {
      await ctx.answerCallbackQuery({
        text: "Gift package processed successfully!",
        show_alert: true,
      });
    } catch (error) {
      console.error("Error in Gift package handler:", error);
    }
  },

  BootCamp: async (...params: PaymentParams) => {
    const [ctx, uniqueId, subscriptionType, mentorshipChannelId, channelId, googleDriveLink, isActive, isExpired] = params;
    
    try {
      await ctx.answerCallbackQuery({
        text: "BootCamp package processed successfully!",
        show_alert: true,
      });
    } catch (error) {
      console.error("Error in BootCamp package handler:", error);
    }
  },
}; 