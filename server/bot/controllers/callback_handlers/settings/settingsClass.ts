import { connectDB } from "../../../../database/connection";
import settingsModel from "../../../models/settings.model";

class Settings {
  public userId: string;
  public settings: any;
  public settingMessage: boolean | null;
  public message: number | null;
  public option: any;
  public callbackQuery: string | null;

  constructor() {
    this.userId = process.env.USER_ID as string;
    this.settings = {};
    this.settingMessage = null;
    this.message = null;
    this.option = null;
    this.callbackQuery = null;
  }

  async getNewSettings(ctx: any): Promise<void> {
    if (this.settingMessage === true) {
      const messageText: string = ctx.update.message.text;
    
      switch (this.callbackQuery) {
        case "oneMonth":
        case "threeMonth":
        case "sixMonth":
        case "oneYear":
        case "nairaPrice":
          if (isNaN(Number(messageText))) {
            const errorReply = await ctx.reply("Error: Please enter a valid number!");
            setTimeout(async () => {
              await ctx.api.deleteMessage(errorReply.chat?.id, errorReply.message_id);
            }, 2000);
            return;
          } else {
            this.message = parseFloat(messageText);
          }
          break;
        default:
          console.log(`Unknown callback data: ${this.callbackQuery}`);
          await ctx.reply("Error: Invalid option selected. Please try again.");
          return;
      }

      await this.updateSettings(this.callbackQuery, this.message);
      const msgReply = await ctx.reply(`Your new setting has been saved as ${this.message}!`);
      setTimeout(async () => {
        await ctx.api.deleteMessage(msgReply.chat?.id, msgReply.message_id);
      }, 2000);
      this.message = null;
      this.settingMessage = null;
    }
  }

  async updateSettings(callbackQuery: string, newData: any): Promise<any> {
    await connectDB();
    let settingsDoc = await settingsModel.findOne({ userId: this.userId });
    let updateDoc: any;
  
    const vipKeys = ['oneMonth', 'threeMonths', 'sixMonths', 'oneYear'];
  
    const isBulkVipPriceUpdate =
      typeof newData === 'object' &&
      Object.keys(newData).every((key) => vipKeys.includes(key));
  
    // ✅ Handle bulk VIP update
    if (isBulkVipPriceUpdate) {
      const vipPriceUpdate: Record<string, number> = {};
      for (const [key, value] of Object.entries(newData)) {
        vipPriceUpdate[`settings.vipDiscountPrice.${key}`] = Number(value);
      }
  
      updateDoc = { $set: vipPriceUpdate };
    }
    // ✅ Handle general single price update (e.g., type = "vip", "mentor", etc.)
    else if (callbackQuery.startsWith("service:")) {
      const [, type, id] = callbackQuery.split(":"); // e.g. "service:vip:1"
      if (!type || !id) throw new Error("Invalid callbackQuery format");
  
      const field = `settings.servicePrices.${type}.${id}`;
      updateDoc = { $set: { [field]: Number(newData) } };
    }
    // ✅ Legacy cases
    else {
      switch (callbackQuery) {
        case "nairaPrice":
          updateDoc = { $set: { [`settings.${callbackQuery}`]: Number(newData) } };
          break;
        case "oneMonth":
        case "threeMonth":
        case "sixMonth":
        case "oneYear":
          updateDoc = {
            $set: { [`settings.vipPrice.${callbackQuery}`]: Number(newData) },
          };
          const result = await this.getSettings();
          this.settings.vipDiscountPrice = result.vipPrice;
          this.settings.vipDiscountPrice[callbackQuery] = Number(newData);
          await this.updateSettings("vipDiscountPrice", this.settings.vipDiscountPrice);
          break;
        case "vipDiscountPrice":
          updateDoc = { $set: { [`settings.${callbackQuery}`]: newData } };
          break;
        default:
          console.warn("Unknown callbackQuery and unrecognized bulk update.");
          return;
      }
    }
  
    if (updateDoc) {
      settingsDoc = await settingsModel.findOneAndUpdate(
        { userId: this.userId },
        updateDoc,
        {
          new: true,
          upsert: true,
          runValidators: false, // 💡 MUST stay here
        }
      );
      if (settingsDoc) {
        await settingsDoc.save();
        this.settings = (settingsDoc as any).settings || {};
      } else {
        this.settings = {};
      }
      // ✅ Re-fetch updated document
      const updatedDoc = await settingsModel.findOne({ userId: this.userId });
      // if (!updatedDoc) throw new Error("Settings not found after update");
      // this.settings = updatedDoc.settings;
      // ✅ Refresh vipDiscountPrice manually after bulk update
      // if (isBulkVipPriceUpdate) {
      //   this.settings.vipDiscountPrice = {
      //     ...this.settings.vipDiscountPrice,
      //     ...newData,
      //   };
      // }
      return this.settings; // ✅ Now returns updated settings
    } else {
      console.log("No updates to apply");
      return;
    }
  }

  async getSettings(): Promise<any> {
    await connectDB();
    const settingsDoc = await settingsModel.findOne({ userId: this.userId });
    if (settingsDoc && (settingsDoc as any).settings) {
      this.settings = (settingsDoc as any).settings;
      return this.settings;
    } else {
      // Create default settings if none exist
      const defaultSettings = {
        nairaPrice: 1000,
        vipPrice: {
          oneMonth: 50,
          threeMonth: 120,
          sixMonth: 200,
          oneYear: 350,
        },
        vipDiscountPrice: {
          oneMonth: 50,
          threeMonth: 120,
          sixMonth: 200,
          oneYear: 350,
        },
        servicePrices: {
          vip: {},
          mentor: {},
        },
      };
      const newSettingsDoc = new settingsModel({
        userId: this.userId,
        settings: defaultSettings,
      });
      try {
        await newSettingsDoc.save();
      } catch (error: any) {
        if (error.code === 11000) {
          // Document already exists, just fetch it
          const existingDoc = await settingsModel.findOne({ userId: this.userId });
          if (existingDoc && (existingDoc as any).settings) {
            this.settings = (existingDoc as any).settings;
            return this.settings;
          }
        }
        throw error;
      }
      this.settings = defaultSettings;
      return this.settings;
    }
  }

  static async getNairaPriceByUserId(userId: number | string): Promise<number> {
    await connectDB();
    const settingsDoc = await settingsModel.findOne({ userId: userId.toString() });
    return (settingsDoc && (settingsDoc as any).settings && (settingsDoc as any).settings.nairaPrice) || 1000;
  }

  getUserID():string{
    return this.userId;
  }
}

const settingsClass = (): Settings => {
  return new Settings();
};

export { settingsClass }; 