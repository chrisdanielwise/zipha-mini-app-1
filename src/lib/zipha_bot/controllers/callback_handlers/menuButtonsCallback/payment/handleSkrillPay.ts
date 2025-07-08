import { Navigation } from "src/lib/zipha_bot/controllers/navigation/navigationClass";
import { Context } from "grammy";


export async function handleSkrillPay(ctx: Context): Promise<void> {
  try {
    const navigation = Navigation.getInstance();
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is missing");
    }
    
    const messageId: number = ctx.update.callback_query.message.message_id;
    
    // Handle Coinbase Pay option
    const replyText = `<b>Please make payment to the address below</b>\n\n
<i>Skrill Payment</i>

<blockquote>
<strong>Skrill Email</strong> : <code> vineedking@gmail.com</code>
</blockquote>
<i>Copy address and make payment and send screeshot of completed payment and wait for confirmation</i>
  `;
    const buttons = [[{ text: "Main Menu", callback_data: "mainmenu" }]]; // your buttons array
    await ctx.reply(replyText, {
      reply_markup: {
        inline_keyboard: buttons,
      },
      parse_mode: "HTML",
    });

    // Update callback info
    navigation.updateCallbackInfo(ctx, "Skrill Payment", messageId);
  } catch (error: any) {
    console.error("Error in handleBtcPay:", error);
  }
}