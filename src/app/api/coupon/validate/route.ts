import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Greybot } from "src/lib/zipha_bot/config/setWebhook";
import { generateCaption, retryApiCall } from "src/lib/zipha_bot/config/utilities";
import screenshotStorage from "src/lib/zipha_bot/controllers/navigation/screenshotStorageClass";
import CatchMechanismClass from "src/lib/zipha_bot/models/catchMechanismClass";
import Coupon from "src/lib/zipha_bot/models/couponClass";
import settingsModel from "src/lib/zipha_bot/models/settings.model";
import { createUserInstance } from "src/lib/zipha_bot/models/userInfoSingleton";

 // Replace with your actual bot instance
 const couponInstance = Coupon.getInstance();
 const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { couponCode, userId, username, messageId, chatId } = body;

    if (!couponCode || !userId || !messageId || !chatId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate coupon
    const settingsDoc = await settingsModel.findOne({
      "settings.codeGeneration.couponCode": couponCode,
    });

    if (!settingsDoc) {
      return NextResponse.json({ valid: false, message: "Coupon code does not exist." });
    }

    const coupon = settingsDoc.settings.codeGeneration.find(
      (c: { couponCode: string }) => c.couponCode === couponCode
    );

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid coupon code." });
    }

    if (coupon.redeemed) {
      return NextResponse.json({
        valid: false,
        message: "Coupon code has already been used.",
      });
    }

    await couponInstance.updateCoupon(coupon.couponId, { redeemed: true });
    await couponInstance.setCouponCodeText(userId, couponCode);

    const serviceOption =
      coupon.options?.length > 1
        ? coupon.options.map((opt) => `\t${opt.text}`).join("\n")
        : coupon.options?.[0]?.text ?? "No service options available.";

    // 2. Save user info
    createUserInstance.setUserProperties(userId, username, {
      from: { id: userId, username },
      chat: { id: chatId },
    } as any); // ⛔ adapt this shape if needed
    createUserInstance.subscriptionStatus("inactive");

    await createUserInstance.saveUserToDB();

    // 3. Screenshot data
    const screenshotData = {
      photoId: "No photoId found",
      messageId,
      username,
    };

    await screenshotStorage.addScreenshot(userId, screenshotData, "Gift");

    // 4. Send to approval channel
    const caption = generateCaption(
      { from: { id: userId, username } } as any,
      serviceOption,
      null,
      null,
      "Free"
    );

    const channelId = process.env.APPROVAL_CHANNEL_ID as string;
    const messageIdCount = (await screenshotStorage.getMessageIdCount(userId)) ?? 0;

    const inlineKeyboard = [
      [{ text: "Approve", callback_data: `approve_${userId}_${messageIdCount - 1}` }],
      [{ text: "Cancel", callback_data: `cancel_${userId}_${messageIdCount - 1}` }],
    ];

    const channelRes = await retryApiCall(() =>
      Greybot.api.sendMessage(channelId, caption, {
        reply_markup: { inline_keyboard: inlineKeyboard },
        parse_mode: "HTML",
      })
    );

    const paymentRes = await retryApiCall(() =>
      Greybot.api.sendMessage(chatId, "Your code has been confirmed. Please wait for approval.", {
        reply_markup: {
          inline_keyboard: [[{ text: "Go Back", callback_data: "goback" }]],
        },
      })
    );

    await screenshotStorage.updateChannelAndPaymentMessageId(
      userId,
      messageId,
      channelRes.message_id,
      paymentRes.message_id
    );

    await catchMechanismClassInstance.addCatchMechanism(userId);
    await couponInstance.setCouponMessageSet(false);

    return NextResponse.json({
      valid: true,
      message: "Coupon applied successfully",
      channelMessageId: channelRes.message_id,
      paymentMessageId: paymentRes.message_id,
    });
  } catch (err) {
    console.error("Gift coupon error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
