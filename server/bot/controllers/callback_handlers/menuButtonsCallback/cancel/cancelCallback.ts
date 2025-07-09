import { Context } from "grammy";
import mongoose from "mongoose";
import screenshotStorage from "server/bot/controllers/navigation/screenshotStorageClass";
import CatchMechanismClass from "server/bot/models/catchMechanismClass";
import Coupon from "server/bot/models/couponClass";
import { sendError } from "../sendErrorMessage";
import { Navigation } from "server/bot/controllers/navigation/navigationClass";

const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);
const couponInstance = Coupon.getInstance();

export async function cancleCallback(
  ctx: Context,
  userId: number,
  action: string
): Promise<void> {
  try {
    if (action === "cancel") {
      const couponCode = await couponInstance.getCouponCodeText(userId);
      const userStorage = await screenshotStorage.getUserStorage(userId);
  
      if (!userStorage) {
        await catchMechanismClassInstance.initialize();
      }
      const screenshotData = await screenshotStorage.getScreenshot(userId);
      if (!screenshotData) {
        throw new Error(`Screenshot data not found for user ${userId}`);
      }
      const username = screenshotData.username;
      
      const caption = `<i>Hello! ${username} your gift has been cancled. Please contact support for further Clearification</i>`;
      if (!screenshotData) {
        return sendError(ctx, "Screenshot data not found.");
      }
      const replyCancel = await ctx.reply(`<i>Message canceled successfull</i>`, { parse_mode: "HTML" });
      await ctx.api.sendMessage(userId, caption, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Contact Support", url: process.env.CONTACT_SUPPORT as string },
              { text: "Go Back", callback_data: "mainmenu" },
            ],
          ],
        },
        parse_mode: "HTML",
      });
      setTimeout(async () => {
        await screenshotStorage.deleteAllScreenshotMessages(ctx, userId);
      }, 1000);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await ctx.api.deleteMessage(replyCancel.chat.id, replyCancel.message_id);
      await couponInstance.deleteCoupon(couponCode);
    } else {
      const navigation = Navigation.getInstance();
      if (!ctx.update.callback_query) {
        throw new Error("Callback query is missing");
      }
      
      const callbackQuery = ctx.update.callback_query;
      
      if (!callbackQuery.message) {
        throw new Error("Callback query message is missing");
      }
      
      if (!callbackQuery.from) {
        throw new Error("Callback query sender is missing");
      }
      
      const messageId: number = callbackQuery.message.message_id;
      const userIdFromQuery: number = callbackQuery.from.id;
      
      await ctx.api.deleteMessage(userIdFromQuery, messageId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await navigation.goBack(ctx);
    }
  } catch (error: any) {
    console.error(`Error in cancelCallback: ${error.message}`);
    sendError(ctx, `Error in cancelCallback: ${error.message}`);
  }
}