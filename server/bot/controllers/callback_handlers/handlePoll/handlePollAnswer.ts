import { Context } from "grammy";
import Coupon from "server/bot/models/couponClass";
import { createUserInstance } from "server/bot/models/userInfoSingleton";

// Define a type for the poll answer object as provided by Telegram
interface PollAnswer {
  poll_id: string;
  option_ids: number[];
  user: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
  };
}

// Define the Option type for our selected options
interface Option {
  callback_data: string;
  text: string;
}

const couponInstance = Coupon.getInstance();

export async function handlePollAnswer(ctx: Context): Promise<void> {
  // Cast ctx.pollAnswer to our PollAnswer type
  const pollAnswer = ctx.pollAnswer as PollAnswer;
  const userId: number = pollAnswer.user.id;
  const pollMessageId = await couponInstance.getPollMessageId() as number;
console.log(pollMessageId,"pollMessageId")
  try {
    // Map option IDs to corresponding option objects
    const selectedOptions: Option[] = pollAnswer.option_ids
      .map((optionId: number): Option | null => {
        switch (optionId) {
          case 0:
            return { callback_data: "one_month", text: "VIP 1 month" };
          case 1:
            return { callback_data: "three_months", text: "VIP 3 months" };
          case 2:
            return { callback_data: "six_months", text: "VIP 6 months" };
          case 3:
            return { callback_data: "twelve_months", text: "VIP 12 months" };
          case 4:
            return { callback_data: "one_on_one_price_list", text: "Mentorship 1 on 1" };
          case 5:
            return { callback_data: "mentorship_price_list", text: "Mentorship Group" };
          default:
            return null;
        }
      })
      .filter((option): option is Option => option !== null);

    // Save the selected options for the user
    await couponInstance.setSelectedOptions(userId, selectedOptions);

    // Create a formatted text for the selected options
    const optionsText = selectedOptions.map((option) => `\n${option.text}`).join("");

    // Find one option that contains one of the desired keywords
    const selectedOption = selectedOptions.find((option) =>
      option.callback_data.includes("month") ||
      option.callback_data.includes("mentorship_price_list") ||
      option.callback_data.includes("one_on_one_price_list")
    );

    // Call subscribe with the selected option's callback_data if available
    if (selectedOption?.callback_data) {
      createUserInstance.subscribe(selectedOption.callback_data);
    } else {
      console.error("Selected option callback_data is missing.");
    }    

    // Send a confirmation message to the user
    await ctx.api.sendMessage(
      userId,
      `You have successfully selected:\n <i>${optionsText}</i>`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Generate Code", callback_data: "generate_code" },
              { text: "Cancel Code", callback_data: "cancleCoupon" },
            ],
          ],
        },
        parse_mode: "HTML",
      }
    );

    // Delete the poll message
    await ctx.api.deleteMessage(userId, pollMessageId);
  } catch (error) {
    console.error("Error handling poll answer:", error);
  }
}