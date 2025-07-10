import settingsModel from "./settings.model";
import { nanoid } from "nanoid";
import { Context } from "grammy";

interface CouponData {
  couponId: number;
  username: string;
  options: { callback_data: string }[];
  redeemed: boolean;
  timestamps: Date;
  couponCode: string;
}

class Coupon {
  private static instance: Coupon;
  private adminUserId: string | undefined;
  private selectedOptions = new Map<string, { callback_data: string }[]>();
  private pollMessageId: number | null = null;
  private couponMessageSet = false;
  private couponCodeText = new Map<string, string>();
  private currentPollAnswer: string;
  private STATES: { VIP_PLAN: string; MENTORSHIP_PLAN: string; GENERATE_COUPON: string; };

  constructor() {
    this.adminUserId = process.env.USER_ID;
    this.selectedOptions = new Map();
    this.pollMessageId = null;
    this.couponMessageSet = false;
    this.STATES = {
      VIP_PLAN: "VIP_PLAN",
      MENTORSHIP_PLAN: "MENTORSHIP_PLAN",
      GENERATE_COUPON: "GENERATE_COUPON",
    };
    this.couponCodeText = new Map();
    this.currentPollAnswer = this.STATES.VIP_PLAN;
  }

  async setCurrentPollAnswer(stateName: keyof typeof this.STATES): Promise<void> {
    this.currentPollAnswer = this.STATES[stateName];
  }

  async getCouponCodeText(userId: number): Promise<string> {
    const id = String(userId);
    const couponText = this.couponCodeText.get(id);
    if (!couponText) {
      throw new Error(`No coupon text found for user ID ${userId}`);
    }
    return couponText;
  }
  
  async setCouponCodeText(userId: number, messageText: string): Promise<void> {
    const id = String(userId);
    if (this.couponCodeText.has(id)) {
      this.couponCodeText.delete(id);
    }
    this.couponCodeText.set(id, messageText);
  }

  async getCurrentPollAnswer(): Promise<string> {
    return this.currentPollAnswer;
  }

  async setCouponMessageSet(value: boolean): Promise<void> {
    this.couponMessageSet = value;
  }

  async getCouponMessageSet(): Promise<boolean> {
    return this.couponMessageSet;
  }

  static getInstance(): Coupon {
    if (!Coupon.instance) {
      Coupon.instance = new Coupon();
    }
    return Coupon.instance;
  }

  async setPollMessageId(pollId: number): Promise<void> {
    try {
      if (!pollId) {
        throw new Error("Poll ID not defined");
      }
      this.pollMessageId = pollId;
      //   console.log(pollId,"pollId")
    } catch (error) {
      console.error("Error setting PollId:", error);
    }
  }

  async getPollMessageId(): Promise<number | undefined> {
    try {
      if (!this.pollMessageId) {
        throw new Error("Poll ID not found");
      }
      return this.pollMessageId;
    } catch (error) {
      console.error("Error getting pollId:", error);
    }
  }

  async setSelectedOptions(userId: number, option: { callback_data: string }[]): Promise<void> {
    const id = String(userId);
    if (this.selectedOptions.has(id)) {
      this.selectedOptions.delete(id);
    }
    this.selectedOptions.set(id, option);
  }
  
  async getSelectedOptions(userId: number): Promise<{ callback_data: string }[]> {
    const id = String(userId);
    const option = this.selectedOptions.get(id);
    if (!option) {
      throw new Error(`No selected option found for user ID ${userId}`);
    }
    return option;
  }

  private async deleteMessageIfExists(ctx: Context, userId: number): Promise<void> {
    const messageId = ctx.update?.callback_query?.message?.message_id;
    if (messageId) await ctx.api.deleteMessage(userId, messageId);
  }

  async generateCoupon(ctx: Context): Promise<void> {
    try {
      const options = ctx.update?.callback_query?.data;
      // const username = ctx.update?.callback_query?.from?.username
      const couponId = ctx.update?.callback_query?.from.id;
      const couponCode = await this.generateCouponCode(); // Assuming generateCouponCode() exists
      const selectedOption = await this.getSelectedOptions(Number(this.adminUserId));
      if (!selectedOption || selectedOption.length === 0) {
        console.error("No selected options found");
        return;
      }
      if (options === "generate_code") {
        if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
          throw new Error("Callback query or its message is missing");
        }
        
        const messageId: number = ctx.update.callback_query.message.message_id;
        
        const userId = ctx.update?.callback_query?.from.id;
        // setTimeout(async () => {\n          await ctx.api.deleteMessage(userId, messageId);\n        // }, 2000);
        await ctx.api.deleteMessage(userId, messageId);
 
        ctx.api.sendMessage(
          userId,
          `<b>Your Code is:</b> <code>${couponCode}</code>`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Coupon List",
                    callback_data: "codeList",
                  },
                ],
                [
                  {
                    text: "Go Back",
                    callback_data: "mainmenu",
                  },
                ],
              ],
            },
            parse_mode: "HTML",
          }
        );
      }
      await settingsModel.findOneAndUpdate(
        { userId: this.adminUserId },
        {
          $push: {
            "settings.codeGeneration": {
              couponId,
              username: "",
              options: selectedOption,
              redeemed: false,
              timestamps: new Date(),
              couponCode,
            },
          },
        },
        { new: true, upsert: true }
      );
      //   console.log("Coupon Generated successfully", result)
    } catch (error) {
      console.error("Error generating coupon:", error);
      throw error;
    }
  }

  async generateCouponCode(): Promise<string> {
    // const { nanoid } = await import("nanoid");
    try {
      return nanoid(6).toUpperCase(); // Generate 6-character unique code
    } catch (error) {
      console.error("Error generating coupon code:", error);
      throw error;
    }
  }

  async getCouponCode(couponCode: string): Promise<CouponData | null> {
    try {
      // Find the settings document where the codeGeneration array contains an element
      // with the matching couponCode and redeemed is false.
      const updatedDoc = await settingsModel.findOneAndUpdate(
        {
          "settings.codeGeneration": {
            $elemMatch: {
              couponCode,
              redeemed: false,
            },
          },
        },
        {
          // Update the first matching coupon's redeemed field to true
          $set: { "settings.codeGeneration.$.redeemed": true },
        },
        {
          new: true, // Return the updated document
          lean: true, // Return a plain JavaScript object
        }
      ) as unknown as { settings: { codeGeneration: any[] } };
  
      if (!updatedDoc) {
        // No matching coupon was found
        return null;
      }
  
      // Extract the coupon from the codeGeneration array
      const coupon = updatedDoc.settings.codeGeneration.find(
        (c: CouponData) => c.couponCode === couponCode
      )
  
      return coupon || null;
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      throw error;
    }
  }

  async updateCoupon(identifier: number | string, updates: Record<string, any>): Promise<void> {
    try {
      if (typeof updates !== "object") {
        throw new Error("Updates must be an object");
      }
      const query =
        typeof identifier === "number"
          ? { "settings.codeGeneration.couponId": identifier }
          : { "settings.codeGeneration.couponCode": identifier };

      const filter =
        typeof identifier === "number"
          ? { "element.couponId": identifier }
          : { "element.couponCode": identifier };

      const update: Record<string, any> = {};
      Object.keys(updates).forEach((key) => {
        update[`settings.codeGeneration.$[element].${key}`] = updates[key];
      });

      await settingsModel.updateOne(query, { $set: update }, { arrayFilters: [filter] });
    } catch (error) {
      console.error("Error updating coupon:", error);
      throw error;
    }
  }

  async getActiveCoupon(ctx: Context): Promise<void> {
    try {
      
      if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
        throw new Error("Callback query or its message is missing");
      }
      if (!ctx.update.callback_query || !ctx.update.callback_query.from) {
        throw new Error("Callback query or sender information is missing");
      }
      
      const userId: number = ctx.update.callback_query.from.id;      
      const messageId: number = ctx.update.callback_query.message.message_id;
      
      const doc = await settingsModel.findOne({ userId: this.adminUserId });
      if (!doc) {
        console.log("Document not found");
        return;
      }
      const codeGeneration = doc.settings.codeGeneration;
      const activeUsers = codeGeneration.filter((user: any) => user.redeemed === false);

      const usersList = activeUsers.map((user: any, index: number) => {
        const optionsList = user.options.map((option: any) => {
          return `• (${option.callback_data})`;
        }).join("\n");

        return `<blockquote>${index + 1}. Please tap to copy code\n\nActive: ${user.active === false ? "No" : "Yes"}\n\nCoupon Code: <code>${user.couponCode}</code>\n\nPackages:\n${optionsList}</blockquote>`;
      });

      const message = `List:\n\n${usersList.join("\n\n<blockquote></blockquote>")}`;
      if (!this.adminUserId) {
        throw new Error("adminUserId is undefined");
      }
      ctx.api.sendMessage(
        this.adminUserId,
        `${message}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Go Back",
                  callback_data: "mainmenu",
                },
              ],
            ],
          },
          parse_mode: "HTML",
        }
      );
      setTimeout(async () => {
        await ctx.api.deleteMessage(userId, messageId);
      }, 2000);
    } catch (error) {
      console.error("Error fetching active coupons:", error);
      throw error;
    }
  }

  async deleteCoupon(couponCode: string): Promise<void> {
    try {
      const doc = await settingsModel.findOne({ userId: this.adminUserId });
      if (!doc) {
        console.log("Document not found");
        return;
      }
      const codeGeneration = doc.settings.codeGeneration;
      const index = codeGeneration.findIndex((obj: any) => obj.couponCode === couponCode);
      if (index === -1) {
        console.log("Coupon not found");
        return;
      }
  
      codeGeneration.splice(index, 1);
      await settingsModel.findOneAndUpdate(
        { userId: this.adminUserId },
        { $set: { "settings.codeGeneration": codeGeneration } },
        { new: true }
      );
      console.log("User coupon deleted successfully");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      throw error;
    }
  }
}

export default Coupon;