import { Navigation } from "src/lib/zipha_bot/controllers/navigation/navigationClass";
import { Settings } from "../../settings/settingsClass";
import { convertToNGN } from "src/lib/zipha_bot/config/utilities";
import { Context } from "grammy";

export async function handleNairaPay(ctx: Context): Promise<void> {
  try {
    // Get the current option from the ctx
    if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
      throw new Error("Callback query or its message is missing");
    }
    
    const option: string | undefined = ctx.update.callback_query?.message?.text;
    const userId: number = Number(process.env.USER_ID);
    
    // Check that option is defined; if not, throw an error.
    if (!option) {
      throw new Error("Option not found");
    }
    
    const dollarPrice: string = option.replace(/(?:.*?\$)(\d+).*$/, "$1");
    
    const navigation = Navigation.getInstance();
    const NAIR_CURRENT_RATE: number = await Settings.getNairaPriceByUserId(userId);
    const defaultNgData = { conversion_rates: { NGN: NAIR_CURRENT_RATE } };
    const ngData = navigation?.nairaPrice || defaultNgData;
    // Check if ngData is defined
    if (ngData) {
      // Convert the dollar price to NGN using the convertToNGN function
      const result = await convertToNGN(Number(dollarPrice), ngData);
;
      let amountInNGN: string = "Unknown";
      let flexibleExchangeRate: string = "Unknown";

      if (result && !("error" in result)) {
        // Now TypeScript knows result has the expected properties.
        amountInNGN = result.amountInNGN.toString();
        flexibleExchangeRate = result.flexibleExchangeRate;
      } else if (result && "error" in result) {
        console.error("Conversion error:", result.error);
      }

      const formartedNairaPrice: string = String(amountInNGN).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
      // Check if dollarPrice is a valid number
      if (isNaN(Number(dollarPrice))) {
        console.error("Error: dollarPrice is not a valid number", option);
        return;
      }
  
      const replyText = `
<strong>Naira Payment (Exclusive for Nigerians)</strong>

<i>Please make payment to the details below</i>

<blockquote>
  
Bank : UBA
  
Bank Name : <code>DOYEN WILSON EHIOKHAI</code>
  
Acc Number : <code>2142459793</code>
  
Amount : ${formartedNairaPrice} NGN
  
</blockquote>
<blockquote>
Current Exchange Rate: $1 USD = ${flexibleExchangeRate} NGN (Rate is subject to change)
</blockquote>
  
<i>Copy Account details and make payment and send screenshot of completed payment here then wait for confirmation.</i>`;
  
      const buttons = [[{ text: "Main Menu", callback_data: "mainmenu" }]];
      const messageId = ctx.update.callback_query.message.message_id;
      await ctx.reply(replyText, {
        reply_markup: {
          inline_keyboard: buttons,
        },
        parse_mode: "HTML",
      });
  
      // Update callback info
      navigation.updateCallbackInfo(ctx, "Naira Payment", messageId);
      // Clear session storage
    } else {
      console.error("Error: ngData is undefined");
      const replyText = `<i>Unable to retrieve NGN exchange rate. Please try again later. Our team is working hard to resolve this issue.</i>`;
      const replyMsg = await ctx.reply(replyText, { parse_mode: "HTML" });
      setTimeout(async () => {
        try {
          await ctx.api.deleteMessage(replyMsg?.chat?.id, replyMsg.message_id);
        } catch (error) {
          console.error("Error deleting reply message:", error);
        }
      }, 5000);
    }
  } catch (error) {
    console.error("Error in Naira Payment:", error);
  }
}