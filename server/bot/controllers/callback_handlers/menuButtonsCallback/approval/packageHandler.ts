import { AllowedOption, getNewInviteLink } from "./getNewInviteLink";
import mongoose from "mongoose";
import { Context } from "grammy";
import Coupon from "server/bot/models/couponClass";
import CatchMechanismClass from "server/bot/models/catchMechanismClass";
import { updateUserDataAndCleanUp } from "./updateUserDataAndCleanUp";
import { createUserInstance } from "server/bot/models/userInfoSingleton";
import { sendMessage } from "./sendMessage";
const couponInstance = Coupon.getInstance();
const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);


const PAYMENT_OPTIONS = {
  FUND_MANAGEMENT: "fund_management",
  ONE_ON_ONE_PRICE_LIST: "one_on_one_price_list",
  MENTORSHIP_PRICE_LIST: "mentorship_price_list",
};
export type PaymentParams = [
  ctx: Context,
  userId: number,
  subscriptionType: AllowedOption,
  MENTORSHIP_CHANNEL_ID: number,
  channelId: number,
  googleDriveLink: string,
  isActive: boolean,
  isExpired: boolean
];

export type PackageHandlerFunction = (...params: PaymentParams) => Promise<void>;

export type BootCampHandlerFunction = (
  ctx: Context,
  userId: number,
  subscriptionType: AllowedOption,
  BOOTCAMP_CHANNEL_ID: number, // ✅ Corrected
  channelId: number,
  googleDriveLink: string,
  isActive: boolean,
  isExpired: boolean
) => Promise<void>;

// Define the packageHandler object type
export type PackageHandler = {
  Generic: PackageHandlerFunction;
  Gift: PackageHandlerFunction;
  BootCamp: BootCampHandlerFunction;
};


export const packageHandler:  PackageHandler = {
  Generic: async (...params:PaymentParams): Promise<void> => {
    const [
      ctx,
      userId,
      subscriptionType,
      , // skipping unused parameter
      , // skipping unused parameter
      googleDriveLink,
      isActive,
      isExpired,
    ] = params;

    try {
      if (!ctx.update.callback_query) return;

      const updateSuccessful = await updateUserDataAndCleanUp(
        ctx,
        userId,
        isActive,
        ctx.update.callback_query.id
      );
      if (!updateSuccessful) {
        throw new Error("Update was not successful");
      }
      const invite_link = createUserInstance.getUserLink();
      let messageText: string;
      let keyboard: any;
  
      switch (subscriptionType) {
        case PAYMENT_OPTIONS.FUND_MANAGEMENT:
          messageText = "Your fund management payment has been approved.";
          keyboard = [
            [
              {
                text: "Access Fund Management",
                url: googleDriveLink,
              },
            ],
            [
              {
                text: "Go Back to Menu",
                callback_data: "mainmenu",
              },
            ],
          ];
          break;
        case PAYMENT_OPTIONS.ONE_ON_ONE_PRICE_LIST:
          messageText = "Welcome to 1 On 1 Mentorship with Kingftp";
          keyboard = [
            [
              {
                text: "DM Kingftp",
                url: googleDriveLink,
              },
            ],
            [
              {
                text: "Go Back to Menu",
                callback_data: "mainmenu",
              },
            ],
          ];
          break;
        case PAYMENT_OPTIONS.MENTORSHIP_PRICE_LIST:
          messageText =
            "You're welcome to the Mentorship section. Please click the link below to join the channel.";
          keyboard = [
            [
              {
                text: "Join Mentorship",
                url: invite_link?.link,
              },
              {
                text: "Go Back to Menu",
                callback_data: "mainmenu",
              },
            ],
          ];
          break;
        default:
          const expiredKeyboard = [
            [
              {
                text: "Renew Subscription",
                url: invite_link?.link,
              },
            ],
            [
              {
                text: "Go Back to Menu",
                callback_data: "mainmenu",
              },
            ],
          ];
  
          const activeKeyboard = [
            [
              {
                text: "Check Subscription Status",
                callback_data: "check_subscription_status",
              },
            ],
          ];
  
          const vipChannelKeyboard = [
            [
              {
                text: "Join VIP Channel",
                url: invite_link?.link,
              },
              {
                text: "Go Back to Menu",
                callback_data: "mainmenu",
              },
            ],
          ];
  
          if (isActive) {
            messageText =
              "Your subscription has been upgraded.\nYou can check your Subscription status for Confirmation.";
            keyboard = activeKeyboard;
          } else if (isExpired) {
            messageText =
              "Your subscription has been renewed.\nWelcome to Kingftp VIP Signal Channel.";
            keyboard = expiredKeyboard;
          } else {
            messageText =
              "Congrats! Your payment has been approved.\nWelcome to Kingftp VIP Signal Channel.";
            keyboard = vipChannelKeyboard;
          }
          break;
      }
  
      await sendMessage(ctx, userId, messageText, keyboard);
  
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "Payment approved!",
        show_alert: true,
      });
  
      await catchMechanismClassInstance.removeUserManagementAndScreenshotStorage(userId);
    } catch (error) {
      console.error("Error occurred:", error);
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "An error occurred. Please try again later.",
        show_alert: true,
      });
    }
  },
  
  Gift: async (...params:PaymentParams): Promise<void> => {
    const [
      ctx,
      userId,
      subscriptionType,
      MENTORSHIP_CHANNEL_ID,
      channelId,
      googleDriveLink,
      isActive,
    ] = params;
    if (!ctx.update.callback_query) return;

    try {
      const updateSuccessful = await updateUserDataAndCleanUp(
        ctx,
        userId,
        isActive,
        ctx.update.callback_query.id
      );
      let vipInviteLink: any, mentorshipInvite: any, messageText: string, keyboard: any;
  
      let hasMonth = false;
      let hasOneOnOne = false;
      let hasMentorshipPrice = false;
  
      if (!updateSuccessful) {
        throw new Error("Update was not successful");
      }
  
      const couponCode = await couponInstance.getCouponCodeText(userId);
      const couponResult = await couponInstance.getCouponCode(couponCode);
       
      if (!couponResult) {
        throw new Error("Coupon result is null or undefined");
      }
      
      const couponSelectedOptions = couponResult.options;
      
  
      couponSelectedOptions.forEach((option: any) => {
        if (option.callback_data.includes("month")) hasMonth = true;
        if (option.callback_data === "one_on_one_price_list") hasOneOnOne = true;
        if (option.callback_data === "mentorship_price_list") hasMentorshipPrice = true;
      });
  
      if (hasMonth && hasOneOnOne && hasMentorshipPrice) {
        mentorshipInvite = await getNewInviteLink(ctx, MENTORSHIP_CHANNEL_ID, "mentorship_price_list");
        vipInviteLink = await getNewInviteLink(ctx, channelId, subscriptionType);
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "Mentorship Group",
              url: mentorshipInvite?.invite_link,
            },
          ],
          [
            {
              text: "One-on-One Mentorship",
              url: googleDriveLink,
            },
          ],
          [
            {
              text: "VIP Link",
              url: vipInviteLink?.invite_link,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasMonth && hasOneOnOne) {
        vipInviteLink = await getNewInviteLink(ctx, channelId, subscriptionType);
  
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "One-on-One Mentorship",
              url: googleDriveLink,
            },
          ],
          [
            {
              text: "VIP Link",
              url: vipInviteLink?.invite_link,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasMonth && hasMentorshipPrice) {
        mentorshipInvite = await getNewInviteLink(ctx, MENTORSHIP_CHANNEL_ID, "mentorship_price_list");
        vipInviteLink = await getNewInviteLink(ctx, channelId, subscriptionType);
  
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "Mentorship Group",
              url: mentorshipInvite?.invite_link,
            },
          ],
          [
            {
              text: "VIP Link",
              url: vipInviteLink?.invite_link,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasOneOnOne && hasMentorshipPrice) {
        mentorshipInvite = await getNewInviteLink(ctx, MENTORSHIP_CHANNEL_ID, "mentorship_price_list");
  
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "Mentorship Group",
              url: mentorshipInvite?.invite_link,
            },
          ],
          [
            {
              text: "One-on-One Mentorship",
              url: googleDriveLink,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasMonth) {
        vipInviteLink = await getNewInviteLink(ctx, channelId, subscriptionType);
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "VIP Link",
              url: vipInviteLink?.invite_link,
            },
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasOneOnOne) {
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "One-on-One Mentorship",
              url: googleDriveLink,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else if (hasMentorshipPrice) {
        mentorshipInvite = await getNewInviteLink(ctx, MENTORSHIP_CHANNEL_ID, "mentorship_price_list");
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            {
              text: "Mentorship Group",
              url: mentorshipInvite?.invite_link,
            },
          ],
          [
            {
              text: "Go Back to Menu",
              callback_data: "mainmenu",
            },
          ],
        ];
      } else {
        // Fallback if no option is matched
        messageText = "Congratulations! You've received a gift subscription.";
        keyboard = [
          [
            { text: "Go Back to Menu", callback_data: "mainmenu" },
          ],
        ];
      }
      await sendMessage(ctx, userId, messageText, keyboard);
  
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "Payment approved!",
        show_alert: true,
      });
  
      await catchMechanismClassInstance.removeUserManagementAndScreenshotStorage(userId);
    } catch (error) {
      console.error("Error occurred:", error);
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "An error occurred. Please try again later.",
        show_alert: true,
      });
    }
  },
  
  BootCamp: async (
    ctx: Context,
    userId: number,
    subscriptionType: AllowedOption,
    BOOTCAMP_CHANNEL_ID: number,
    channelId: number,
    googleDriveLink: string,
    isActive: boolean,
    isExpired: boolean
  ): Promise<void> => {
    try {
      const updateSuccessful = await updateUserDataAndCleanUp(
        ctx,
        userId,
        isActive, // ✅ Now using the correct parameter
        ctx.update.callback_query?.id ?? "" // ✅ Safe access
      );
      if (!updateSuccessful) {
        throw new Error("Update was not successful");
      }
  
      const bootcamp_link = await getNewInviteLink(ctx, BOOTCAMP_CHANNEL_ID, subscriptionType);
      const messageText = "Welcome to BootCamp!";
      const keyboard = [
        [{ text: "Start BootCamp", url: bootcamp_link?.invite_link }],
        [{ text: "Go Back to Menu", callback_data: "mainmenu" }],
      ];
  
      await sendMessage(ctx, userId, messageText, keyboard);
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "Payment approved!",
        show_alert: true,
      });
  
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await catchMechanismClassInstance.removeUserManagementAndScreenshotStorage(userId);
    } catch (error) {
      console.error("Error occurred in BootCamp:", error);
      await ctx.answerCallbackQuery({
        // callback_query_id: ctx.update.callback_query.id,
        text: "An error occurred. Please try again later.",
        show_alert: true,
      });
    }
  },
  
};
