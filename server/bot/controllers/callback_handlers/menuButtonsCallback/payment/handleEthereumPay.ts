import { Navigation } from "../../../navigation/navigationClass";
import { Context } from "grammy";


export async function handleEthereumPay(ctx: Context): Promise<void> {
  try {
    const navigation = Navigation.getInstance();
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is missing");
    }
    
    const messageId: number = ctx.update.callback_query.message.message_id;
    
    // Handle Coinbase Pay option
    const replyText = `<b>Please make payment to the address below</b>\n\n
<i>Ethereum Payment</i>

<blockquote>

Address: <code> 0x1b0f6181caaea9c86822fb3795930c1a0c4d317a</code>

Network: <b>( ERC20 )</b>

</blockquote>
<i>Copy address and make payment and send screenshot of completed payment and wait for confirmation</i>
  `;
    const buttons = [[{ text: "Main Menu", callback_data: "mainmenu" }]]; // your buttons array

    await ctx.reply(replyText, {
      reply_markup: {
        inline_keyboard: buttons,
      },
      parse_mode: "HTML",
    });
  
    // Update callback info
    navigation.updateCallbackInfo(ctx, "ERC", messageId);
  
  } catch (error: any) {
    console.error("Error in handleBtcPay:", error);
  }
} 