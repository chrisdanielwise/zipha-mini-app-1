import { Context } from "grammy";
import { Navigation } from "../../../navigation/navigationClass";

export async function sendMessage(
  ctx: Context,
  userId: number,
  messageText: string,
  inlineKeyboard: any[][]
): Promise<void> {
  const inviteLinkMessage = await ctx.api.sendMessage(userId, messageText, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });

  const navigation = Navigation.getInstance();
  const currentOptions = navigation.userMenuOptions.get(userId) || {
    stack: [],
    previousMenuMessageId: new Map<string, number>(),
    faqIndex: 0,
  };
  
  navigation.userMenuOptions.set(userId, {
    ...currentOptions,
    inviteLinkId: inviteLinkMessage.message_id,
  });
  
}