import { Context } from "grammy";

// Define the interfaces for screenshot data and user storage.
// Define your ScreenshotData interface
// Represents a single screenshot entry with a single photo and corresponding message IDs
export interface Screenshot {
  photoId: string;
  messageId?: number;
  channelMessageId?: number;
  paymentMessageId?: number;
}

// Updated ScreenshotWithId for entries with an additional ID (e.g., for tracking/deletion)
export interface ScreenshotWithId extends Screenshot {
  screenshotId: string;
}

// Updated UserStorage: now holds an array of normalized Screenshot objects
export interface UserStorage {
  userId: number;
  username: string;
  screenshots: Screenshot[]; // Normalized: each object holds one set of ids
  package:string | null
  paymentOption: string | null;
  paymentType: string | null;
  serviceOption: string | null;
  isExpired: boolean;
  isActive: boolean;
}


 class ScreenshotStorage {
 

 // Use a Map where the key is the user ID (as string) and the value is the UserStorage.
 private storage: Map<string, UserStorage> = new Map();

 /**
  * Adds a new user to the storage if not already present.
  */
 async addUser(userId: number, username: string): Promise<UserStorage> {
   const id = String(userId);
   if (!this.storage.has(id)) {
     const user: UserStorage = {
       userId,
       username,
       screenshots: [],
       paymentOption: null,
       paymentType: null,
       package:null,
       serviceOption: null,
       isExpired: false,
       isActive: false,
     };
     this.storage.set(id, user);
   }
   return this.storage.get(id)!;
 }

 /**
  * Adds a new screenshot entry with one photoId and one messageId.
  */
 async addScreenshot(
  userId: number,
  screenshotData: { photoId: string; messageId: number; username: string },
  packageType: string = "Generic"
): Promise<UserStorage> {
  const id = String(userId);
  const { photoId, messageId, username } = screenshotData;

  let userStorage = this.storage.get(id);

  if (!userStorage) {
    userStorage = await this.addUser(userId, username);
  } else {
    userStorage.username = username;
  }

  // Update the user package
  userStorage.package = packageType;

  // Check if screenshot with same messageId already exists
  const exists = userStorage.screenshots.some(s => s.messageId === messageId);
  if (!exists) {
    const newScreenshot: Screenshot = {
      photoId,
      messageId,
    };
    userStorage.screenshots.push(newScreenshot);
  }

  this.storage.set(id, userStorage);
  return userStorage;
}

 /**
  * Returns the count of screenshots (used to mimic messageIdCount).
  */
 async getMessageIdCount(userId: number): Promise<number> {
   const id = String(userId);
   const userStorage = this.storage.get(id);
   if (!userStorage) {
     throw new Error("User storage not found");
   }
   return userStorage.screenshots.length;
 }

 /**
  * Updates the latest screenshot with new channel and payment message IDs.
  */
 async updateChannelAndPaymentMessageId(
  userId: string | number,
  messageId: number,
  channelMessageId: number,
  paymentMessageId: number
): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (!userStorage || userStorage.screenshots.length === 0) return;

  const targetScreenshot = userStorage.screenshots.find(
    (s) => s.messageId === messageId
  );
  if (!targetScreenshot) return;

  targetScreenshot.channelMessageId = channelMessageId;
  targetScreenshot.paymentMessageId = paymentMessageId;

  this.storage.set(id, userStorage);
}

 /**
  * Returns the complete UserStorage for a given user.
  */
 async getUserStorage(userId: number): Promise<UserStorage | undefined> {
   const id = String(userId);
   return this.storage.get(id);
 }
/**
 * Deletes all screenshot messages for the user.
 * Iterates over each screenshot entry and deletes channel, user, and payment messages
 * in chunks with retry logic.
 */
async deleteAllScreenshotMessages(ctx: Context, userId: number): Promise<boolean> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  const channelId = process.env.APPROVAL_CHANNEL_ID as string;
  const deletedMessageIds = new Set<number>();
  const CHUNK_SIZE = 10;
  const timeout = 5000;

  if (!userStorage || !userStorage.screenshots || userStorage.screenshots.length === 0) {
    console.log(`No screenshots found for user ${userId}`);
    return true;
  }

  // Collect all individual message IDs
  const channelMessageIds: number[] = [];
  const messageIds: number[] = [];
  const paymentMessageIds: number[] = [];

  for (const screenshot of userStorage.screenshots) {
    if (screenshot.channelMessageId) {
      channelMessageIds.push(screenshot.channelMessageId);
    }
    if (screenshot.messageId) {
      messageIds.push(screenshot.messageId);
    }
    if (screenshot.paymentMessageId) {
      paymentMessageIds.push(screenshot.paymentMessageId);
    }
  }

// Helper to process message deletions with retry logic
const processDeletion = async (
  ids: number[],
  deleteFn: (msgId: number) => Promise<any> // changed from Promise<void>
) => {
  const chunkedIds: number[][] = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    chunkedIds.push(ids.slice(i, i + CHUNK_SIZE));
  }

  for (const chunk of chunkedIds) {
    await Promise.all(chunk.map(async (msgId) => {
      try {
        await deleteFn(msgId);
        deletedMessageIds.add(msgId);
      } catch (error: any) {
        if (error.description === "Bad Request: message to delete not found") {
          deletedMessageIds.add(msgId);
        } else {
          console.error(`Error deleting message ${msgId}:`, error);
          await new Promise((res) => setTimeout(res, timeout));
          try {
            await deleteFn(msgId);
            deletedMessageIds.add(msgId);
          } catch (retryError) {
            console.error(`Failed to delete message ${msgId} after retry:`, retryError);
          }
        }
      }
    }));
  }

  return ids.filter((msgId) => !deletedMessageIds.has(msgId));
};


  // Run deletions
  await processDeletion(channelMessageIds, (msgId) => ctx.api.deleteMessage(channelId, msgId));
  await processDeletion(messageIds, (msgId) => ctx.api.deleteMessage(userId, msgId));
  await processDeletion(paymentMessageIds, (msgId) => ctx.api.deleteMessage(userId, msgId));

  console.log("Finished deleting all screenshot messages for user", userId);
  return true;
}


 /**
 * Returns the latest screenshot entry for the given user.
 */
 async getScreenshot(userId: number): Promise<{
  username: string;
  screenshots: Screenshot[];
} | undefined> {
  const id = String(userId);
  const userStorage = this.storage.get(id);

  if (userStorage) {
    return {
      username: userStorage.username,
      screenshots: userStorage.screenshots,
    };
  } else {
    throw new Error("Screenshot data not found");
  }
}


/**
 * Returns all user storage data.
 */
async getAllUsers(): Promise<UserStorage[]> {
  const allUsers: UserStorage[] = [];
  for (const [, userStorage] of this.storage.entries()) {
    allUsers.push({
      ...userStorage,
      screenshots: [...userStorage.screenshots],
    });
  }
  return allUsers;
}

/**
 * Returns all screenshot entries for a given user.
 */
async getAllScreenshots(userId: number): Promise<Screenshot[]> {
  const id = String(userId);
  return this.storage.get(id)?.screenshots ?? [];
}

/**
 * Update a user's storage object completely.
 */
async updateUserStorage(userId: number, updatedUserStorage: UserStorage): Promise<void> {
  const id = String(userId);
  if (this.storage.has(id)) {
    this.storage.set(id, updatedUserStorage);
  } else {
    console.error(`User ${id} not found in storage`);
  }
}

/**
 * Reset storage values for a user.
 */
async resetScreenshotStorage(userId: number): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (userStorage) {
    userStorage.paymentOption = null;
    userStorage.paymentType = null;
    userStorage.serviceOption = null;
    userStorage.isExpired = false;
    userStorage.isActive = false;
    userStorage.username = '';
    userStorage.screenshots = [];
    userStorage.package = ''
    this.storage.set(id, userStorage);
  }
}

/**
 * Remove the latest screenshot entry for a user.
 */
async removeScreenshot(userId: number): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (userStorage && userStorage.screenshots.length > 0) {
    userStorage.screenshots.pop();
    console.log("Removed latest screenshot from stack for user", id);
    this.storage.set(id, userStorage);
  }
}

/**
 * Clear all screenshots from all users.
 */
async clearAllScreenshots(): Promise<void> {
  try {
    for (const [id, userStorage] of this.storage.entries()) {
      userStorage.screenshots = [];
      this.storage.set(id, userStorage);
    }
    console.log("All user screenshots cleared");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}

/**
 * Remove a user's entire storage entry.
 */
async removeUser(userId: number): Promise<void> {
  const id = String(userId);
  this.storage.delete(id);
  console.log("User removed from stack");
}

/**
 * Update the subscription status for a user.
 */
async updateSubscriptionStatus(userId: number, subscriptionStatus: string): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (!userStorage) return;

  switch (subscriptionStatus) {
    case "active":
      userStorage.isActive = true;
      userStorage.isExpired = false;
      break;
    case "expired":
      userStorage.isExpired = true;
      userStorage.isActive = false;
      break;
    case "inactive":
      userStorage.isActive = false;
      userStorage.isExpired = false;
      break;
    default:
      return;
  }

  this.storage.set(id, userStorage);
}

/**
 * Set and get payment/service options.
 */
async setPaymentOption(userId: number, value: any): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (!userStorage) return console.error(`User ${id} not found in storage`);
  userStorage.paymentOption = value;
}

async getPaymentOption(userId: number): Promise<any> {
  return this.storage.get(String(userId))?.paymentOption ?? null;
}

async setPaymentType(userId: number, value: any): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (!userStorage) return console.error(`User ${id} not found in storage`);
  userStorage.paymentType = value;
}

async getPaymentType(userId: number): Promise<any> {
  return this.storage.get(String(userId))?.paymentType ?? null;
}

async getServiceOption(userId: number): Promise<any> {
  return this.storage.get(String(userId))?.serviceOption ?? null;
}

async setServiceOption(userId: number, value: any): Promise<void> {
  const id = String(userId);
  const userStorage = this.storage.get(id);
  if (!userStorage) return console.error(`User ${id} not found in storage`);
  userStorage.serviceOption = value;
}

/**
 * Get snapshot of full user screenshot storage.
 */
async getScreenshotStorageData(userId: number): Promise<any> {
  const userStorage = this.storage.get(String(userId));
  if (!userStorage) throw new Error(`Screenshot storage options not found for userId: ${userId}`);
  return {
    userId: userStorage.userId,
    username: userStorage.username,
    screenshots: [...userStorage.screenshots],
    package: userStorage.package,
    paymentOption: userStorage.paymentOption,
    paymentType: userStorage.paymentType,
    serviceOption: userStorage.serviceOption,
    isExpired: userStorage.isExpired,
    isActive: userStorage.isActive,
  };
}

/**
 * Add multiple users to the storage.
 */
async addAllUsers(users: any[]): Promise<void> {
  if (!Array.isArray(users)) throw new Error("Invalid users array");
  for (const user of users) {
    if (!user?.userId) continue;
    const id = String(user.userId);
    if (!this.storage.has(id)) {
      const newUser: UserStorage = {
        userId: user.userId,
        username: user.username,
        screenshots: Array.isArray(user.screenshots) ? user.screenshots : [],
        package: user.package,
        paymentOption: user.paymentOption ?? null,
        paymentType: user.paymentType ?? null,
        serviceOption: user.serviceOption ?? null,
        isExpired: user.isExpired ?? false,
        isActive: user.isActive ?? false,
      };
      try {
        this.storage.set(id, newUser);
      } catch (error) {
        console.error(`Error adding user to storage: ${error}`);
      }
    }
  }
}

}
const screenshotStorage = new ScreenshotStorage()
export default screenshotStorage