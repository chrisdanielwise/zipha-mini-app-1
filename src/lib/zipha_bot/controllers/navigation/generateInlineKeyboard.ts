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
      const button: InlineKeyboardButton = {} as InlineKeyboardButton;
      if (option.url) {
        button.text = option.text;
        button.url = option.url;
      } else {
        button.text = option.text;
        button.callback_data = option.callback_data;
      }
      row.push(button);
    });
    keyboard.push(row);
  });
  return keyboard;
}