import { Context } from "grammy";
import mongoose, { ClientSession } from "mongoose";
import { handleUpdateError } from "./handleUpdateError";
import { createUserInstance } from "server/bot/models/userInfoSingleton";
import { retryApiCall, updateSubscriptionAndExpirationDate } from "server/bot/config/utilities";
import { UserInfo } from "server/bot/models/userManagementClass";
import screenshotStorage from "server/bot/controllers/navigation/screenshotStorageClass";

// Update the function signature to include callbackQueryId since it is used below.
export async function updateUserDataAndCleanUp(
  ctx: Context,
  userId: number,
  isActive: boolean,
  callbackQueryId: string
): Promise<boolean> {
  // Approval actions
  const userSubscription = createUserInstance.getUserSubscription();
  const userLink = createUserInstance.getUserLink();
  const updateData = {
    subscription: userSubscription,
    inviteLink: userLink,
  };

  let updated = true;

  // Check if the subscription type contains "month"
  if (userSubscription?.type && userSubscription.type.includes("month")){
    const session: ClientSession = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (isActive) {
          await retryApiCall(() =>
            updateSubscriptionAndExpirationDate(userId, userSubscription?.type as string)
          );
        } else {
          if (
            userSubscription?.status === "pending" &&
            userLink?.link &&
            userLink?.name
          ) {
            await retryApiCall(() => UserInfo.updateUser(userId, updateData));
          } else {
            throw new Error("Invalid subscription status or incomplete invite link");
          }
        }
      });
    } catch (error) {
      updated = false;
      console.error(`Error updating user ${userId} data:`, error);
      await handleUpdateError(error, updateData, ctx);
    } finally {
      await session.endSession();
    }
  }

  try {
    const deletionResult = await screenshotStorage.deleteAllScreenshotMessages(ctx, userId);
    if (deletionResult) {
      await screenshotStorage.removeUser(userId);
    }
  } catch (error) {
    // Note: In the new grammy typings, answerCallbackQuery doesn't require a callback_query_id property.
    await ctx.answerCallbackQuery({
      text: "Error deleting message!",
      show_alert: true,
    });
    console.error(`Error deleting message for user ${userId}:`, error);
  }

  return updated;
}