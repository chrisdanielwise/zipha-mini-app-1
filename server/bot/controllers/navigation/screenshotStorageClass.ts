import { Context } from "grammy";

export interface Screenshot {
  photoId: string;
  messageId?: number;
  channelMessageId?: number;
  paymentMessageId?: number;
}

export interface UserStorage {
  userId: number;
  username: string;
  screenshots: Screenshot[];
  package: string | null;
  paymentOption: string | null;
  paymentType: string | null;
  serviceOption: string | null;
  isExpired: boolean;
  isActive: boolean;
}

class ScreenshotStorage {
  private static instance: ScreenshotStorage;
  private storage: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ScreenshotStorage {
    if (!ScreenshotStorage.instance) {
      ScreenshotStorage.instance = new ScreenshotStorage();
    }
    return ScreenshotStorage.instance;
  }

  public store(userId: string, data: any): void {
    this.storage.set(userId, data);
  }

  public get(userId: string): any {
    return this.storage.get(userId);
  }

  public remove(userId: string): void {
    this.storage.delete(userId);
  }

  public clear(): void {
    this.storage.clear();
  }

  async addAllUsers(users: any[]): Promise<void> {
    try {
      console.log(`Adding ${users.length} users to screenshot storage`);
      for (const user of users) {
        if (user && user.userId) {
          this.storage.set(String(user.userId), {
            userId: user.userId,
            username: user.username || "",
            screenshots: user.screenshots || [],
            package: user.package || null,
            paymentOption: user.paymentOption || null,
            paymentType: user.paymentType || null,
            serviceOption: user.serviceOption || null,
            isExpired: user.isExpired || false,
            isActive: user.isActive || false
          });
        }
      }
    } catch (error) {
      console.error("Error adding users to screenshot storage:", error);
    }
  }

  async getScreenshotStorageData(userId: number): Promise<any> {
    try {
      const userData = this.storage.get(String(userId));
      return userData || {
        userId: userId,
        username: "",
        screenshots: [],
        package: null,
        paymentOption: null,
        paymentType: null,
        serviceOption: null,
        isExpired: false,
        isActive: false
      };
    } catch (error) {
      console.error(`Error getting screenshot storage data for ${userId}:`, error);
      return null;
    }
  }

  setPaymentType(userId: number, paymentType: string): void {
    console.log(`Setting payment type for user ${userId}: ${paymentType}`);
    // Add payment type logic here
  }

  setPaymentOption(userId: number, paymentOption: string): void {
    console.log(`Setting payment option for user ${userId}: ${paymentOption}`);
    // Add payment option logic here
  }

  setServiceOption(userId: number, serviceOption: string): void {
    console.log(`Setting service option for user ${userId}: ${serviceOption}`);
    // Add service option logic here
  }

  async getUserStorage(userId: number): Promise<any> {
    console.log(`Getting user storage for user ${userId}`);
    return this.getScreenshotStorageData(userId);
  }

  async updateSubscriptionStatus(userId: number, status: string): Promise<void> {
    console.log(`Updating subscription status for user ${userId}: ${status}`);
    // Add subscription status update logic here
  }

  async addUser(userId: number, username: string): Promise<void> {
    console.log(`Adding user ${userId} with username ${username}`);
    // Add user logic here
  }

  async getServiceOption(userId: number): Promise<string> {
    console.log(`Getting service option for user ${userId}`);
    return "default_service";
  }

  async addScreenshot(userId: number, screenshotData: any, type: string): Promise<any> {
    console.log(`Adding screenshot for user ${userId}, type: ${type}`);
    return { success: true };
  }

  async getPaymentOption(userId: number): Promise<string> {
    console.log(`Getting payment option for user ${userId}`);
    return "default_payment";
  }

  async getPaymentType(userId: number): Promise<string> {
    console.log(`Getting payment type for user ${userId}`);
    return "default_type";
  }

  async getMessageIdCount(userId: number): Promise<number> {
    console.log(`Getting message ID count for user ${userId}`);
    return 1;
  }

  async updateChannelAndPaymentMessageId(
    userId: number,
    messageId: number,
    channelMessageId: number,
    paymentMessageId: number
  ): Promise<void> {
    console.log(`Updating channel and payment message IDs for user ${userId}`);
    // Add implementation here
  }
}

export default ScreenshotStorage.getInstance(); 