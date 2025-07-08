import CatchMechanismClass from "src/lib/zipha_bot/models/catchMechanismClass";
import { Context } from "grammy";
import mongoose from "mongoose";
import screenshotStorage from "../../navigation/screenshotStorageClass";
import { createUserInstance } from "src/lib/zipha_bot/models/userInfoSingleton";
import { SubscriptionStatus } from "./constants";
import { approveCallback } from "../menuButtonsCallback/approval/approveCallback";
import { handleError } from "./errorHandler";

const catchMechanismClassInstance = CatchMechanismClass.getInstance(mongoose.connection);

export async function handleSubscriptionAction(
  ctx: Context,
  uniqueId: number,
  subscriptionAction: string
): Promise<void> {
  try {
    const userStorage = await screenshotStorage.getUserStorage(uniqueId);
    if (!userStorage) {
      await catchMechanismClassInstance.initialize();
    }
    const userSubscription = createUserInstance.getUserSubscription();
    const subscriptionStatus = userSubscription?.status;

    if (subscriptionStatus) {
      await screenshotStorage.updateSubscriptionStatus(uniqueId, subscriptionStatus);
    }
    if (subscriptionStatus !== SubscriptionStatus.PENDING) {
      createUserInstance.subscriptionStatus(SubscriptionStatus.PENDING);
    }
    await approveCallback(ctx, uniqueId);
  } catch (error: any) {
    console.error(`Error handling subscription action ${subscriptionAction}:`, error);
    handleError(ctx, error);
  }
}