import { Navigation } from "../../../navigation/navigationClass";
import { Context } from "grammy";


export async function handleBtcPay(ctx: Context): Promise<void> {
  try {
    const navigation = Navigation.getInstance();
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is missing");
    }
    
    const messageId: number = ctx.update.callback_query.message.message_id;
    
    // Handle Coinbase Pay option
    const replyText = `<b>Please make payment to the addresses below</b>\n\n
<i>BTC Payment</i>

<blockquote>
<strong>BTC Address</strong> : <code>1PEkj7q6FXnQS589CeUnyRz7PY6CnCj1Mi</code>
</blockquote>
<i>Copy address and make payment and send screenshot of completed payment and wait for</i>
`;
    const buttons = [[{ text: "Main Menu", callback_data: "mainmenu" }]];
    await ctx.reply(replyText, {
      reply_markup: {
        inline_keyboard: buttons,
      },
      parse_mode: "HTML",
    });

    // Update callback info
    navigation.updateCallbackInfo(ctx, "BTC", messageId);
  } catch (error: any) {
    console.error("Error in handleBtcPay:", error);
  }
} 