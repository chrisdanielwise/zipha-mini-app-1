import { Context } from "grammy";
import { settingsClass } from "./settingsClass";

export async function handleSettingsChange(ctx: Context): Promise<void> {
  const settings = settingsClass();
  if (!ctx.update.callback_query) return;

  const propertyName = ctx.update.callback_query.data;
  console.log("Received Callback Query:", ctx);
  console.log("Extracted propertyName:", propertyName);
  switch (propertyName) {
    case "nairaPrice":
    case "oneMonth":
    case "threeMonth":
    case "sixMonth":
    case "oneYear":
      if (!ctx.chat) return;
      await ctx.api.sendMessage(
        ctx.chat.id, 
        `Enter your new ${["threeMonth", "sixMonth"].includes(propertyName) ? propertyName + "s" : propertyName}:`
      );      
      settings.callbackQuery = propertyName;
      settings.settingMessage = true;
      break;
    case "vipDiscountPrice":
      settings.callbackQuery = propertyName;
      break;
    default:
      console.log(`Unknown property name: ${propertyName}`);
      return;
  }
}