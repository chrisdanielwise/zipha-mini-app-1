import { Context } from "grammy";
import { Navigation } from "server/bot/controllers/navigation/navigationClass";

export async function handleBankTransfer(ctx: Context): Promise<void> {
  try {
    const navigation = Navigation.getInstance();
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is missing");
    }
    
    const messageId: number = ctx.update.callback_query.message.message_id;
    
    const replyText = `
<blockquote>
<b>
Here is a payment method Easy to Send up for bank transfer. You can go to App Store or Playstore and download the app.
All information you need to complete payment are given below. Once done send a screenshot of prove and your payment will be approved with a link sent to you.
</b>
</blockquote>

<strong>USA🇺🇸 , UK 🇬🇧, CANADA 🇨🇦, BELGIUM 🇧🇪, AUSTRIA 🇦🇹, FRANCE 🇫🇷, GERMANY 🇩🇪, IRELAND 🇮🇪, ITALY 🇮🇹, SPAIN 🇪🇸, PORTUGAL 🇵🇹, UNITED ARAB EMIRATES 🇦🇪, NETHERLANDS 🇳🇱, MAYOTTE 🇾🇹, Payments : </strong>

<strong>Download TAP TAP SEND on AppStore or PlayStore </strong>

<blockquote>
Phone number :<code>+2349038989084</code>

Bank Acc : KUDA BANK 

Acc Name : Doyen Wilson 

Acc Number :<code> 2009525948</code>
</blockquote>
<blockquote>
Gmail : <code> kingftpzoom@gmail.com  </code>
</blockquote>
<strong>Send screenshot / Hash receipts to validate payment.</strong>
`;
    const buttons = [
      [
        {
          text: "Google play",
          url: process.env.BANK_TRANSFER_URL as string,
        },
        {
          text: "App Store",
          url: process.env.BANK_TRANSFER_URL as string,
        },
      ],
      [
        {
          text: "Go Back",
          callback_data: "mainmenu",
        },
        {
          text: "Main Menu",
          callback_data: "mainmenu",
        },
      ],
    ];
    await ctx.reply(replyText, {
      reply_markup: {
        inline_keyboard: buttons,
      },
      parse_mode: "HTML",
    });
    // Update callback info
    navigation.updateCallbackInfo(ctx, "Binance Pay", messageId);
  } catch (error) {
    console.error("Error in handleBinancePay:", error);
  }
}
