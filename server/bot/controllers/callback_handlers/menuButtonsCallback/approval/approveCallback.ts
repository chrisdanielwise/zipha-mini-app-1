import { Context } from "grammy";
import mongoose from "mongoose";
import CatchMechanismClass from "server/bot/models/catchMechanismClass";
import { AllowedOption, getNewInviteLink } from "./getNewInviteLink";
import screenshotStorage from "server/bot/controllers/navigation/screenshotStorageClass";
import { createUserInstance } from "server/bot/models/userInfoSingleton";
import { packageHandler } from "./packageHandler";


const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);

const ALLOWED_PAYMENT_OPTIONS = {
  MENTORSHIP_PRICE_LIST: "mentorship_price_list",
  BOOTCAMP_PAYMENT: "bootcamp_payment",
  ONE_MONTH: "one_month",
  THREE_MONTHS: "three_months",
  SIX_MONTHS: "six_months",
  TWELVE_MONTHS: "twelve_months",
};
interface EnvVariables {
  VIP_SIGNAL_ID: number;
  MENTORSHIP_CHANNEL_ID: number;
  BOOTCAMP_CHANNEL_ID: number;
  GOOGLE_DRIVE_LINK: string;
  ADMIN_ID: number;
}
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
export async function approveCallback(ctx: Context, uniqueId: number): Promise<void> {
  try {

  // First cast process.env to unknown and then to EnvVariables
  const env = process.env as unknown as EnvVariables;

  const {
    VIP_SIGNAL_ID: channelId,
    MENTORSHIP_CHANNEL_ID,
    BOOTCAMP_CHANNEL_ID,
    GOOGLE_DRIVE_LINK: googleDriveLink,
    ADMIN_ID,
  } = env;
    
  
    // const {
    //   callback_query: {
    //     message: {
    //       message_id: messageId,
    //       chat: { id: chatId },
    //     },
    //     // id: callbackQueryId,
    //   },
    // } = ctx.update;
    const messageId = ctx.update.callback_query?.message?.message_id;
    const chatId = ctx.update.callback_query?.message?.chat?.id;

    if (ctx.update.callback_query && ctx.update.callback_query.message) {
      const {
        message: {
          message_id: messageId,
          chat: { id: chatId },
        },
      } = ctx.update.callback_query;
    }
    
  
    const userStorage = await screenshotStorage.getUserStorage(uniqueId);
    if (!userStorage) {
      await catchMechanismClassInstance.initialize();
    }
    if (!userStorage) {
      await ctx.answerCallbackQuery({
        // callback_query_id: callbackQueryId,
        text: "User storage data not found.",
        show_alert: true,
      });
      console.error("User storage data not found for userId:", uniqueId);
      return;
    }
  
    const subscriptionType = createUserInstance.getSubscriptionType() as AllowedOption
    const { isExpired, isActive } = userStorage;
    const screenshotData = await screenshotStorage.getScreenshot(uniqueId);
    if (!screenshotData) {
      await ctx.answerCallbackQuery({
        // callback_query_id: callbackQueryId,
        text: "Error handling screenshot data.",
        show_alert: true,
      });
      return;
    }
  
    // const { username, userId: screenshotUserId, package: userPackage } = screenshotData;
  
    if (!messageId) {
      await ctx.answerCallbackQuery({
        // callback_query_id: callbackQueryId,
        text: "🤦‍♂️ Message ID not found!",
        // parse_mode: "HTML",
        show_alert: true,
      });
      return;
    }
  
    // Input validation
    if (
      !channelId ||
      !MENTORSHIP_CHANNEL_ID ||
      !googleDriveLink ||
      !ADMIN_ID ||
      !BOOTCAMP_CHANNEL_ID
    ) {
      await ctx.reply(
        "🤦‍♂️ Configuration error! \n\n<i>Possible reasons:</i>\n\n1. Environment variables not set\n2. Technical issues\n3. Network problems\n\n<i>Contact support for assistance.</i>\n\n<i>We're here to help! 👉</i>",
        { parse_mode: "HTML" }
      );
      return;
    }
  
    if (!subscriptionType) {
      await ctx.answerCallbackQuery({
        // callback_query_id: callbackQueryId,
        text: `🤦‍♂️ Invalid payment option ${subscriptionType}!`,
        // parse_mode: "HTML",
        show_alert: true,
      });
      return;
    }
  
    // Generate the new invite link based on payment option
    switch (subscriptionType) {
      case ALLOWED_PAYMENT_OPTIONS.ONE_MONTH:
      case ALLOWED_PAYMENT_OPTIONS.THREE_MONTHS:
      case ALLOWED_PAYMENT_OPTIONS.SIX_MONTHS:
      case ALLOWED_PAYMENT_OPTIONS.TWELVE_MONTHS: {
        const vipInviteLink = await getNewInviteLink(ctx, channelId, subscriptionType);
        createUserInstance.storeUserLink(vipInviteLink.invite_link, vipInviteLink.name);
        break;
      }
      case ALLOWED_PAYMENT_OPTIONS.MENTORSHIP_PRICE_LIST: {
        const mentorshipInvite = await getNewInviteLink(ctx, MENTORSHIP_CHANNEL_ID, subscriptionType);
        createUserInstance.storeUserLink(mentorshipInvite.invite_link, mentorshipInvite.name);
        break;
      }
    }
  
    // Handle package-specific actions
    
    type PackageHandlerKeys = "Generic" | "Gift" | "BootCamp";

    // If userPackage is not typed, you can cast it:
    const packageKey: PackageHandlerKeys = (userStorage.package as PackageHandlerKeys) || "Generic";
    const handlePackage = packageHandler[packageKey];
    
    if (typeof handlePackage === "function") {
      await handlePackage(
        ctx, 
        uniqueId, 
        subscriptionType, 
        MENTORSHIP_CHANNEL_ID, 
        channelId, 
        googleDriveLink, 
        isActive, 
        isExpired
      );
      
      
    } else {
      console.error(`No handler found for subscription type: ${subscriptionType}`);
    }
    
    
    
  } catch (error: any) {
    console.error("Error in approveCallback:", error.message);
    await ctx.answerCallbackQuery({
      // callback_query_id: ctx.update.callback_query.id,
      text: "An error occurred. Please try again later.",
      show_alert: true,
    });
  }
}