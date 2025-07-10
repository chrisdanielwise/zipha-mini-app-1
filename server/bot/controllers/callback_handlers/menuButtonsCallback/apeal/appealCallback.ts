import catchMechanismClass from "../../../../models/catchMechanismClass";
import { Broadcast } from "../../../navigation/broadcast_singleton";
import screenshotStorage from "../../../navigation/screenshotStorageClass";
import { Context } from "grammy";
import mongoose from "mongoose";
import { sendError } from "../sendErrorMessage";

const catchMechanismClassInstance = catchMechanismClass.getInstance(mongoose.connection);

export async function appealCallback(
  ctx: Context,
  userId: number,
  action: string,
  messageIdCount: number
): Promise<void> {
  try {
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is undefined");
    }
    const messageId: number = ctx.update.callback_query.message.message_id;
    
    const broadcast = Broadcast(); // Assuming Broadcast is a class/function that returns an instance
    const userStorage = await screenshotStorage.getUserStorage(userId);
    if (!userStorage) {
      await catchMechanismClassInstance.initialize();
    }
    const screenshotData = await screenshotStorage.getScreenshot(userId);
    if (!screenshotData || !screenshotData.screenshots?.[messageIdCount]) {
      return sendError(ctx, "Screenshot data not found.");
    }
    const {username,screenshots} = screenshotData
    const screenshot = screenshots[messageIdCount]; // get correct index
    
    const userID = userId;
    const photoId = screenshot.photoId;
    const messageID = screenshot.messageId;

    broadcast.active = true;
    broadcast.message = ctx.update.callback_query.message;
    broadcast.userId = {
      userID,
      photoId,
      messageID,
      action,
    };
    broadcast.messageId = messageId;

    if (!ctx.chat) {
      return sendError(ctx, "Chat context not available.");
    }

    const replyAppeal = await ctx.reply(
      `Appeal will be sent to this @${username}. Enter your message.`,
      { parse_mode: "HTML" }
    );

    if (!replyAppeal.chat || !replyAppeal.chat.id) {
      return sendError(ctx, "Sorry, something went wrong. Please try again later.");
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 5000));
    await ctx.api.deleteMessage(replyAppeal.chat.id, replyAppeal.message_id);
  } catch (error: any) {
    console.error(`Error in appealCallback: ${error.message}`);
    sendError(ctx, `Error in appealCallback: ${error.message}`);
  }
}