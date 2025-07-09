// import { connectDB } from "src/lib/zipha_bot/config/connection";
// import settingsModel from "src/lib/zipha_bot/models/settings.model";

import settingsModel from "server/bot/models/settings.model";
import { connectDB } from "server/database/connection";

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
  // async updateSettings(callbackQuery: string, newData: any): Promise<any> {
  //   let settingsDoc = await settingsModel.findOne({ userId: this.userId });
  // // console.log(callbackQuery,newData,"callbackQuery,newData")
  //   let updateDoc: any;
  
  //   // Check if the incoming newData is an object with multiple fields (like all vip prices)
  //   const vipKeys = ['oneMonth', 'threeMonths', 'sixMonths', 'oneYear'];

  //   // ✅ Check if it's a bulk VIP price update (by shape)
  //   const isBulkVipPriceUpdate = (
  //     typeof newData === 'object' &&
  //     Object.keys(newData).every((key) => vipKeys.includes(key))
  //   );
  
  
  //   if (isBulkVipPriceUpdate) {
  //     // Rebuild the update structure to match nested vipPrice keys
  //     const vipPriceUpdate: Record<string, number> = {};
  //     for (const [key, value] of Object.entries(newData)) {
  //       vipPriceUpdate[`settings.vipDiscountPrice.${key}`] = value as number
  //     }
  
  //     updateDoc = { $set: vipPriceUpdate };
  //     await connectDB();      
  //   } else {
  //     switch (callbackQuery) {
  //       case "nairaPrice":
  //         updateDoc = { $set: { [`settings.${callbackQuery}`]: Number(newData) } };
  //         break;
  //       case "oneMonth":
  //       case "threeMonth":
  //       case "sixMonth":
  //       case "oneYear":
  //         updateDoc = {
  //           $set: {
  //             [`settings.vipPrice.${callbackQuery}`]: Number(newData),
  //           },
  //         };
  //         const result = await this.getSettings();
  //         this.settings.vipDiscountPrice = result.vipPrice;
  //         this.settings.vipDiscountPrice[callbackQuery] = Number(newData);
  //         await this.updateSettings("vipDiscountPrice", this.settings.vipDiscountPrice);
  //         break;
  //       case "vipDiscountPrice":
  //         updateDoc = { $set: { [`settings.${callbackQuery}`]: newData } };
  //         break;
  //       default:
  //         console.warn("Unknown callbackQuery and unrecognized bulk update.");
  //         return;
  //     }
  //   }
  
  //   if (updateDoc) {
  //     settingsDoc = await settingsModel.findOneAndUpdate(
  //       { userId: this.userId },
  //       updateDoc,
  //       {
  //         new: true,
  //         upsert: true,
  //         runValidators: false, // 💡 MUST stay here
  //       }
  //     );
      
  //     await settingsDoc.save();
  //     this.settings = settingsDoc.settings;

  //       // ✅ Re-fetch updated document
  //   const updatedDoc = await settingsModel.findOne({ userId: this.userId });
  //   // if (!updatedDoc) throw new Error("Settings not found after update");

  //   // this.settings = updatedDoc.settings;

  //   // ✅ Refresh vipDiscountPrice manually after bulk update
  //   // if (isBulkVipPriceUpdate) {
  //   //   this.settings.vipDiscountPrice = {
  //   //     ...this.settings.vipDiscountPrice,
  //   //     ...newData,
  //   //   };
  //   // }
  //     return this.settings; // ✅ Now returns updated settings
  //   } else {
  //     console.log("No updates to apply");
  //     return;
  //   }
  // }
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
          runValidators: false,
        }
      );
  
      await settingsDoc.save();
      this.settings = settingsDoc.settings;
  
      return this.settings;
    } else {
      console.log("No updates to apply");
      return;
    }
  }
  

  async getSettings(): Promise<any> {
    let settingsDoc = await settingsModel.findOne({ userId: this.userId });
    if (!settingsDoc) {
      // Create a new document if one doesn't exist
      settingsDoc = await settingsModel.create({
        userId: this.userId,
        settings: {
          language: "",
          notificationPreferences: false,
          nairaPrice: 1600,
          vipPrice: {
            oneMonth: 52,
            threeMonths: 112,
            sixMonths: 212,
            oneYear: 402,
          },
          vipDiscountPrice: {
            oneMonth: 52,
            threeMonths: 112,
            sixMonths: 212,
            oneYear: 402,
          },
        },
      });
      await settingsDoc.save();
    }
    this.settings = settingsDoc.settings;
    return this.settings;
  }

  static async getNairaPriceByUserId(userId: number | string): Promise<number> {
    const settingsDoc = await settingsModel.findOne({ userId });
    return settingsDoc.settings.nairaPrice;
  }
 getUserID():string{
    return this.userId;
  }
}

let instance: Settings | null = null;

const settingsClass = (): Settings => {
  if (!instance) {
    instance = new Settings();
  }
  return instance;
};

export { settingsClass, Settings };