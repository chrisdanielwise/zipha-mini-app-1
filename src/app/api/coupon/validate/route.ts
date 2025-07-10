import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
// import { getGreybot } from "../../../../../server/bot/config/setWebhook";
// import { generateCaption, retryApiCall } from "../../../../../server/bot/config/utilities";
// import settingsModel from "../../../../../server/bot/models/settings.model";

export async function POST(req: NextRequest) {
  try {
    // Commented out problematic imports and functionality for now
    // const screenshotStorage = (await import("../../../../../server/bot/controllers/navigation/screenshotStorageClass")).default;
    // const CatchMechanismClass = (await import("../../../../../server/bot/models/catchMechanismClass")).default;
    // const Coupon = (await import("../../../../../server/bot/models/couponClass")).default;
    // const { createUserInstance } = await import("../../../../../server/bot/models/userInfoSingleton");

    // const couponInstance = Coupon.getInstance();
    // const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);
    
    const body = await req.json();
    const { couponCode, userId, username, messageId, chatId } = body;

    if (!couponCode || !userId || !messageId || !chatId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Temporarily return a placeholder response
    return NextResponse.json({
      valid: false,
      message: "Coupon validation temporarily disabled",
      error: "Service under maintenance"
    }, { status: 503 });

    // Commented out all the original logic for now
    /*
    // 1. Validate coupon
    const settingsDoc = await settingsModel.findOne({
      "settings.codeGeneration.couponCode": couponCode,
    });

    if (!settingsDoc) {
      return NextResponse.json({ valid: false, message: "Coupon code does not exist." });
    }

    const coupon = (settingsDoc as any).settings.codeGeneration.find(
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
        ? coupon.options.map((opt: any) => `\t${opt.text}`).join("\n")
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
      { from: { id: userId, username } },
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
      getGreybot().api.sendMessage(channelId, caption, {
        reply_markup: { inline_keyboard: inlineKeyboard },
        parse_mode: "HTML",
      })
    );

    const paymentRes = await retryApiCall(() =>
      getGreybot().api.sendMessage(chatId, "Your code has been confirmed. Please wait for approval.", {
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
    */
  } catch (err) {
    console.error("Gift coupon error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


