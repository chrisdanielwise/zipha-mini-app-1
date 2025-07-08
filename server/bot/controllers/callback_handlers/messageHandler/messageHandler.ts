import { Context } from "grammy";
import mongoose from "mongoose";
import { Broadcast } from "../../navigation/broadcast_singleton";
import { Navigation } from "../../navigation/navigationClass";
import { settingsClass } from "../settings/settingsClass";
import screenshotStorage from "../../navigation/screenshotStorageClass";
import { handleGiftCoupon } from "../settings/handleGiftCoupon";
import Coupon from "../../../models/couponClass";
import CatchMechanismClass from "../../../models/catchMechanismClass";
import { generateCaption, retryApiCall } from "../../../config/utilities";
import { userInfoSingletonInstance } from "../../../models/userInfoSingleton";

const couponInstance = Coupon.getInstance();
const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);

const paymentOptions: string[] = [
  "$10,000",
  "$50,000",
  "Group Mentorship Fee",
  "1 - On - 1     Fee",
  "1 Month",
  "3 Months",
  "6 Months",
  "12 Months",
];

const paymentTypes: string[] = [
  "USDT",
  "Naira Payment",
  "BTC",
  "Foreign Payment",
  "Skrill Payment",
  "Ethereum Payment",
];

export async function handleMessages(ctx: Context): Promise<void> {
  const message = ctx?.message;
  const broadcast = Broadcast();
  const navigation = Navigation.getInstance();
  if (ctx.from?.id === undefined) {
    throw new Error("User ID is missing!");
  }
  if (!ctx.from?.username) {
    throw new Error("Username is required but missing!");
  }
  
  navigation.uniqueUser = ctx.from.id;
  

  broadcast.userId = { id: ctx.chat?.id ?? null }; // Assign as an object
  navigation.uniqueUser = ctx.chat?.id ?? null;
  
  const settings = settingsClass();

  try {
    if (message?.text?.includes("@")) {
      const enteredUsername = message.text.replace("@", "");

      if (ctx.update?.callback_query) {
        await retryApiCall(() =>
          ctx.answerCallbackQuery({
            // callback_query_id: ctx.update.callback_query.id,
            text: `Your username has been saved as: ${enteredUsername} channelId : ${message.chat?.id}`,
            show_alert: true,
          })
        );
      }
    } else if (message?.text === "/start") {
      await navigation.goToMainMenu(ctx);
      await screenshotStorage.addUser(ctx.from?.id, ctx.from?.username);
      navigation.uniqueUser = ctx.from?.id ?? null;
    }
    else if(message?.text === "/menu"){
      await ctx.reply("Choose an option:", {
        reply_markup: {
          keyboard: [[
            {
              text: "Zipha  App",
              web_app: { url: process.env.TELEGRAM_URL || "" }
            } 
          ]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    }
    else if (message?.text) {
      const settingMessage = settings.settingMessage;
      const CouponMessageSet = await couponInstance.getCouponMessageSet();
      const USER_ID = Number(process.env.USER_ID);

      if (settingMessage && ctx.chat?.id === USER_ID) {
        await retryApiCall(() => settings.getNewSettings(ctx));
      }

      if (CouponMessageSet) {
        await retryApiCall(() => handleGiftCoupon(ctx));
      }
    } else if (message?.photo) {
      await handlePhotoMessage(ctx, message);
    }
  } catch (error) {
    await handleError(ctx, error);
  }
}

async function handlePhotoMessage(ctx: Context, message: any): Promise<void> {
  // Extract the user ID and username from the incoming message context.
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  // Log the message ID for debugging.
  // console.log(message.message_id, "message.message_id");

  // If the user ID is missing, send an error message and stop processing.
  if (!userId) {
    await handleErrorMessage(ctx, message, "Could not verify user ID. Restart or contact support.", 10000);
    return;
  }

  // If the username is missing, prompt the user to set one.
  if (!username) {
    await handleErrorMessage(ctx, message, "Please add a username in Telegram settings.", 10000);
    return;
  }

  // Set the user properties and update the subscription status to "inactive"
        userInfoSingletonInstance.setUserProperties(userId, username, ctx);
      userInfoSingletonInstance.subscriptionStatus("inactive");

  // Try to save the user information in the database.
  try {
    await userInfoSingletonInstance.saveUserToDB();
  } catch (error: any) {
    await handleErrorMessage(ctx, message, "Error saving user data.", 5000);
    return;
  }

  // Extract the photo ID from the message. We use the last (highest quality) photo in the array.
  const photoId = message.photo[message.photo.length - 1].file_id;

  // Get the service option (e.g. "Vip Signal", "3 Days BootCamp") from screenshotStorage for this user.
  const serviceOption = await screenshotStorage?.getServiceOption(userId);
  const messageId = message.message_id
  // Add the screenshot data (photo ID, message ID, and username) to the user's storage.
  const userStorage = await screenshotStorage.addScreenshot(
    userId,
    { photoId, messageId, username },
    serviceOption === "3 Days BootCamp" ? "BootCamp" : "Generic"
  );

  // If adding the screenshot failed, send an error message and stop.
  if (!userStorage) {
    await handleErrorMessage(ctx, message, "Error storing screenshot data.", 5000);
    return;
  }

  // Define valid payment options based on the service option.
  let validPaymentOptions: string[];
  switch (serviceOption) {
    case "Vip Signal":
      validPaymentOptions = paymentOptions.filter((option) => option.includes("Month"));
      break;
    case "Mentorship":
      validPaymentOptions = ["Group Mentorship Fee", "1"];
      break;
    case "3 Days BootCamp":
      validPaymentOptions = ["Pay Fee: $79.99"];
      break;
    case "Fund Management":
      validPaymentOptions = paymentOptions.filter((option) => option.includes("$10,000"));
      break;
    default:
      await handleErrorMessage(ctx, message, "Invalid service option selected.", 5000);
      return;
  }

  // Retrieve the payment option and payment type for the user.
  const paymentOption = await screenshotStorage?.getPaymentOption(userId);
  const paymentType = await screenshotStorage?.getPaymentType(userId);

  // Normalize the payment option by removing any text after a dash and trimming whitespace.
  const normalizedPaymentOption = paymentOption?.replace(/-.*/, "").trim();
  // Normalize the payment type.
  const normalizedPaymentType = (paymentType || "").trim();

  // Check if the selected payment option and type are valid.
  if (!validPaymentOptions.includes(normalizedPaymentOption)) {
    await handleErrorMessage(ctx, message, `Invalid payment option for ${serviceOption}.`, 5000);
    return;
  }
  if (!paymentTypes.includes(normalizedPaymentType)) {
    await handleErrorMessage(ctx, message, "Invalid payment type.", 15000);
    return;
  }

  // Generate a caption for the photo based on the context and payment/service options.
  const caption = generateCaption({ ctx, serviceOption, paymentOption, paymentType });

  // Get the channel ID from environment variables (where the approval messages should be sent).
  const channelId = Number(process.env.VIP_SIGNAL_ID);

  // Send the photo with caption to the channel for approval.
  try {
    await ctx.api.sendPhoto(channelId, photoId, {
      caption: caption,
      parse_mode: "HTML",
    });

    // Send a confirmation message to the user.
    await ctx.reply(
      "✅ Your screenshot has been submitted successfully! We'll review it and get back to you soon.",
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.error("Error sending photo to channel:", error);
    await handleErrorMessage(ctx, message, "Error submitting screenshot. Please try again.", 5000);
  }
}

async function handleErrorMessage(ctx: Context, message: any, errorMessage: string, timeOut: number): Promise<void> {
  try {
    const errorReply = await ctx.reply(`❌ ${errorMessage}`);
    setTimeout(async () => {
      try {
        await ctx.api.deleteMessage(errorReply.chat?.id, errorReply.message_id);
        await ctx.api.deleteMessage(message.chat?.id, message.message_id);
      } catch (deleteError) {
        console.error("Error deleting messages:", deleteError);
      }
    }, timeOut);
  } catch (error) {
    console.error("Error handling error message:", error);
  }
}

async function handleError(ctx: Context, error: any): Promise<void> {
  console.error("Error in handleMessages:", error);
  try {
    await ctx.reply("❌ An error occurred. Please try again or contact support.");
  } catch (replyError) {
    console.error("Error sending error message:", replyError);
  }
} 