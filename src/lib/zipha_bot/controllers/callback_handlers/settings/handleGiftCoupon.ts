import { Context } from "grammy";
import mongoose from "mongoose";
import Coupon from "src/lib/zipha_bot/models/couponClass";
import CatchMechanismClass from "src/lib/zipha_bot/models/catchMechanismClass";
import settingsModel from "src/lib/zipha_bot/models/settings.model";
import { createUserInstance } from "src/lib/zipha_bot/models/userInfoSingleton";
import screenshotStorage from "../../navigation/screenshotStorageClass";
import { generateCaption, retryApiCall } from "src/lib/zipha_bot/config/utilities";


const couponInstance = Coupon.getInstance();
const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);

interface CouponData {
  valid: boolean;
  options?: { text: string }[];
  message: string;
}

async function validateCouponCode(couponCode: string): Promise<CouponData> {
  const settingsDoc = await settingsModel.findOne({
    "settings.codeGeneration.couponCode": couponCode,
  });

  if (!settingsDoc) {
    return { valid: false, message: "Coupon code does not exist." };
  }

  const coupon = settingsDoc.settings.codeGeneration.find(
    (c: { couponCode: string }) => c.couponCode === couponCode
  );

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }

  if (coupon.redeemed) {
    return {
      valid: false,
      message: "Coupon code has already been used by another user.",
    };
  }

  await couponInstance.updateCoupon(coupon.couponId, { redeemed: true });

  return {
    valid: true,
    options: coupon.options,
    message: "Your code has been confirmed. Please wait for approval.",
  };
}

export const handleGiftCoupon = async (ctx: Context) => {
  const messageText = ctx.update?.message?.text;
  const username = ctx.from?.username ?? "UnknownUser";
  const userId = ctx.from?.id;
  const messageId = ctx.update?.message?.message_id;

  if (!messageText || !userId || !messageId) {
    await ctx.reply("Invalid request. Please try again.");
    return;
  }

  const data = await validateCouponCode(messageText);
  await couponInstance.setCouponCodeText(userId, messageText);

  if (data.valid) {
    const serviceOption: string =
    data.options && data.options.length > 1
      ? data.options.map((opt) => `\t${opt.text}`).join("\n")
      : data.options?.[0]?.text ?? "No service options available.";
  
    // Store user information before sending screenshot
    createUserInstance.setUserProperties(userId, username, ctx);
    createUserInstance.subscriptionStatus("inactive");

    try {
      await createUserInstance.saveUserToDB();
    } catch (error) {
      console.error("Error saving user data. Please try again later:", error);
      return;
    }

    const screenshotData = {
      photoId: "No photoId found",
      messageId,
      username,
    };

    await screenshotStorage.addScreenshot(userId, screenshotData, "Gift");

    const caption = generateCaption(ctx, serviceOption, null, null, "Free");
    const channelId = process.env.APPROVAL_CHANNEL_ID as string;
    const messageIdCount = (await screenshotStorage.getMessageIdCount(userId)) ?? 0;

    const inlineKeyboard = [
      [{ text: "Approve", callback_data: `approve_${userId}_${messageIdCount - 1}` }],
      [{ text: "Cancel", callback_data: `cancel_${userId}_${messageIdCount - 1}` }],
    ];

    const responseChannel = await retryApiCall(() =>
      ctx.api.sendMessage(channelId, caption, {
        reply_markup: { inline_keyboard: inlineKeyboard },
        parse_mode: "HTML",
      })
    );

    const responsePayment = await retryApiCall(() =>
      ctx.reply(data.message, {
        reply_markup: {
          inline_keyboard: [[{ text: "Go Back", callback_data: "goback" }]],
        },
      })
    );

    const channelMessageId = responseChannel.message_id;
    const paymentMessageId = responsePayment.message_id;

    await screenshotStorage.updateChannelAndPaymentMessageId(
      userId,
      messageId,
      channelMessageId,
      paymentMessageId
    );

    await catchMechanismClassInstance.addCatchMechanism(userId);
    await couponInstance.setCouponMessageSet(false);
  } else {
    const replyMarkup = {
      inline_keyboard: [[{ text: "Main Menu", callback_data: "mainmenu" }]],
    };

    await ctx.reply(data.message, { reply_markup: replyMarkup });
    await couponInstance.setCouponMessageSet(false);
  }
};