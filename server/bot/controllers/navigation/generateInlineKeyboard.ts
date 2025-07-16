// Path: server/bot/controllers/navigation/generateInlineKeyboard.ts

interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export function generateInlineKeyboard(
  options: InlineKeyboardButton[][]
): InlineKeyboardButton[][] {
  const keyboard: InlineKeyboardButton[][] = [];
  options.forEach((optionRow) => {
    const row: InlineKeyboardButton[] = [];
    optionRow.forEach((option) => {
      // Prioritize 'url' if available and valid
      if (option.url) {
        row.push({ text: option.text, url: option.url });
      } else if (option.callback_data && option.callback_data.length > 0) {
        // Ensure callback_data is a non-empty string as required by Telegram API
        row.push({ text: option.text, callback_data: String(option.callback_data) });
      } else {
        // Log an error for buttons that are neither URL nor valid callback_data buttons
        // These buttons would cause the "Text buttons are unallowed" error.
        console.error("Skipping invalid inline button: missing valid callback_data and url", option);
        // Optionally, you might throw an error here if you want to fail fast:
        // throw new Error(`Invalid inline button: ${JSON.stringify(option)} must have either callback_data or url`);
      }
    });
    // Only add rows that contain at least one valid button
    if (row.length > 0) {
      keyboard.push(row);
    }
  });
  return keyboard;
}