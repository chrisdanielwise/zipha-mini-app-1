
import { Context } from "grammy";
import { groupInfo } from "server/bot/config/menuInfo";
import { Navigation } from "server/bot/controllers/navigation/navigationClass";


export async function handleFAQText(ctx: Context, direction: string): Promise<void> {
  if (!ctx.from) {
    throw new Error("User information is missing in the context.");
  }
  try {
    const navigation = Navigation.getInstance();
    const faqArray = groupInfo["FAQs"];
  
    const currentIndex: number | null = navigation.getFAQIndex(ctx.from.id);
    // Initialize previousMenuMessageId if it doesn't exist
    if (!navigation.userMenuOptions.has(ctx.from.id)) {
      navigation.userMenuOptions.set(ctx.from.id, {
        stack: [] as any[],
        previousMenuMessageId: new Map<string, number>(),
        faqIndex: 0,
      });
    }
    const userMenuOptions = navigation.userMenuOptions.get(ctx.from.id);
    const replyMarkup = {
      inline_keyboard: faqArray.length > 5
        ? [
            [
              { text: "<< Prev", callback_data: "prev_faq" },
              { text: "Next >>", callback_data: "next_faq" },
            ],
            [
              { text: "Main Menu", callback_data: "mainmenu" },
            ],
          ]
        : [
            [{ text: "Main Menu", callback_data: "mainmenu" }],
          ],
      resize_keyboard: true,
      one_time_keyboard: true,
    };

    const deletePreviousMessage = async (previousMessageId: number | null): Promise<void> => {
      if (previousMessageId !== null) {
        try {
          if (!ctx.chat || !ctx.chat.id) {
            throw new Error("User information is missing in the context.");
          }
          await ctx.api.deleteMessage(ctx.chat.id!, previousMessageId);
        } catch (error: any) {
          if (
            error.error_code === 400 &&
            error.description === "Bad Request: message to delete not found"
          ) {
            console.log("Message to delete not found. Skipping delete operation.");
          } else {
            console.log("Error deleting reply message:");
          }
        }
      }
    };

    const editMessageText = async (faqText: string): Promise<void> => {
      try {
        if (!ctx.chat || !ctx.chat.id) {
          throw new Error("User information is missing in the context.");
        }
        if (!ctx.update.callback_query || !ctx.update.callback_query.message) {
          throw new Error("Callback query or its message is missing");
        }
        await ctx.api.editMessageText(
          ctx.chat.id!,
          ctx.update.callback_query.message.message_id,
          faqText,
          {
            reply_markup: replyMarkup,
            parse_mode: "HTML",
            // disable_web_page_preview: true,
          }
        );
      } catch (error: any) {
        if (
          error.error_code === 400 &&
          error.description === "Bad Request: message to edit not found"
        ) {
          console.log("Message to edit not found. Skipping edit.");
        } else {
          throw error;
        }
      }
    };

    let previousMessageId: number | null = null;
    switch (direction) {
      case `next_${currentIndex}`: {
  
        const safeIndex: number = currentIndex ?? 0; // if currentIndex is null, use 0
        const nextIndex = (safeIndex + 5) % faqArray.length;

        previousMessageId = userMenuOptions
        ? userMenuOptions.previousMenuMessageId.get(`next_${currentIndex}`) || null
        : null;
        const nextFaqText = getFaqText(nextIndex, 5);
        await deletePreviousMessage(previousMessageId);
        navigation.setFAQIndex(ctx.from.id, nextIndex);
        await editMessageText(nextFaqText);
        break;
      }
      case `prev_${currentIndex}`: {
        const safeIndex: number = currentIndex ?? 0; 
        const prevIndex = (safeIndex - 5 + faqArray.length) % faqArray.length;
        previousMessageId = userMenuOptions
        ? userMenuOptions.previousMenuMessageId.get(`next_${currentIndex}`) || null
        : null;
        const prevFaqText = getFaqText(prevIndex, 5);
        await deletePreviousMessage(previousMessageId);
        navigation.setFAQIndex(ctx.from.id, prevIndex);
        await editMessageText(prevFaqText);
        break;
      }
      case "FAQ": {
        if (!ctx.chat || !ctx.chat.id) {
          throw new Error("User information is missing in the context.");
        }
        navigation.setFAQIndex(ctx.from.id, 0);
        const faqText = getFaqText(0, 5);
        await ctx.api.sendMessage(ctx.chat.id!, faqText, {
          reply_markup: replyMarkup,
          parse_mode: "HTML",
        });
        break;
      }
      default:
        console.log("Invalid direction");
    }
  } catch (error) {
    console.error("Error in handleFAQText:", error);
  }
};

const getFaqText = (startIndex: number, count: number): string => {
  let faqText = "";
  const faqArray:any = groupInfo["FAQs"];
  for (let i = startIndex; i < startIndex + count && i < faqArray.length; i++) {
    faqText += `<strong>${faqArray[i].question}</strong>\n\n<blockquote>${faqArray[i].answer}</blockquote>\n\n`;
  }
  return faqText;
};