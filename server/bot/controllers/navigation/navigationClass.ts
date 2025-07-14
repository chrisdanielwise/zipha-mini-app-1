import { Context } from "grammy";
import screenshotStorage from "./screenshotStorageClass";
import { generateInlineKeyboard } from "./generateInlineKeyboard";
import { getMenuOptions } from "./getMenuOptions";
import { groupInfo } from "../../config/menuInfo";


let maintenanceInProgress: boolean = false;

interface UserMenuOptions {
  stack: any[]; // You can improve this type by defining specific menu option types if needed
  previousMenuMessageId: Map<string, number>;
  inviteLinkId?: number | null;
  faqIndex: number;
}

export class Navigation {
  public userMenuOptions: Map<number, UserMenuOptions>;
  public menuMessageId: number | null;
  public uniqueUser: number | null;
  public nairaPrice: any;
  static instance: Navigation;

  constructor() {
    this.userMenuOptions = new Map<number, UserMenuOptions>();
    this.menuMessageId = null;
    this.uniqueUser = null;
    this.nairaPrice = null;
  }

  static getInstance(): Navigation {
    if (!Navigation.instance) {
      Navigation.instance = new Navigation();
    }
    return Navigation.instance;
  }

  async navigate(ctx: Context, option: any, callback: any = null): Promise<void> {
    if (!ctx.chat?.id) {
      throw new Error("Chat ID not found");
    }
    const userId: number = ctx.chat.id;
    let userMenuOptions = this.userMenuOptions.get(userId);
    if (!userMenuOptions) {
      userMenuOptions = {
        stack: [],
        previousMenuMessageId: new Map<string, number>(),
        faqIndex: 0,
        inviteLinkId: null,
      };
      this.userMenuOptions.set(userId, userMenuOptions);
    }
    const stack = userMenuOptions.stack;
    const previousMenuMessageId = userMenuOptions.previousMenuMessageId;

    stack.push(option);
    await this.updateMenu(ctx, option.option ? option.option : option);
    const previousMenu = stack[stack.length - 2]; // Get the previous menu from the stack
    previousMenuMessageId.set(previousMenu, this.menuMessageId as number);

    if (callback && typeof callback === "function") {
      const result = callback(ctx, option || null);
      if (result && typeof result.then === "function") {
        await result;
      }
    }
  }

  async goBack(ctx: Context): Promise<void> {
    if (!ctx.chat?.id) {
      throw new Error("Chat ID not found");
    }
    const userId: number = ctx.chat.id;
    
    const userMenuOptions = this.userMenuOptions.get(userId);
    if (userMenuOptions) {
      const previousOption = userMenuOptions.stack[userMenuOptions.stack.length - 1];
      const Option = userMenuOptions.stack[userMenuOptions.stack.length - 2];
      const prevMenuMsgId = userMenuOptions.previousMenuMessageId.get(previousOption);
      if (prevMenuMsgId) {
        try {
          await ctx.api.deleteMessage(userId, prevMenuMsgId);
          userMenuOptions.previousMenuMessageId.delete(previousOption);
        } catch (error: any) {
          if (error.error_code === 400 && error.description === "Message to delete not found") {
            console.log("Message has already been deleted");
          } else {
            console.error("Error deleting message:");
          }
        }
      }
      if (userMenuOptions.stack.length > 1) {
        userMenuOptions.stack.pop(); // Remove the last element
        await this.updateMenu(ctx, { option: Option });
      } else if (userMenuOptions.stack.length === 1) {
        userMenuOptions.stack = []; // Empty the stack
        await this.updateMenu(ctx, "Main Menu");
      } else {
        await this.goToMainMenu(ctx);
      }
    }
  }

  async goToMainMenu(ctx: Context): Promise<void> {
    try {
      if (!ctx.chat?.id || !ctx.from?.username) {
        throw new Error("Chat ID not found");
      }
      const userId: number = ctx.chat.id;
      const username:string = ctx.from.username;
      let userMenuOptions = this.userMenuOptions.get(userId);

      if (!userMenuOptions) {
        userMenuOptions = {
          stack: [],
          previousMenuMessageId: new Map<string, number>(),
          inviteLinkId: null,
          faqIndex: 0,
        };
        this.userMenuOptions.set(userId, userMenuOptions);
      } else {
        userMenuOptions.stack = [];
        userMenuOptions.previousMenuMessageId = new Map<string, number>();
        userMenuOptions.inviteLinkId = null;
        userMenuOptions.faqIndex = 0;
      }

      if (userMenuOptions?.previousMenuMessageId?.size > 0) {
        const chatId: number = userId;
        const previousMenu = userMenuOptions.stack[userMenuOptions.stack.length - 1];
        const prevMenuMsgId = userMenuOptions.previousMenuMessageId.get(previousMenu);

        if (prevMenuMsgId) {
          try {
            await ctx.api.deleteMessage(chatId, prevMenuMsgId);
          } catch (error: any) {
            if (error.error_code === 400 && error.description === "Bad Request: message to delete not found") {
              console.log(`Message not found, skipping deletion`);
            } else {
              throw error;
            }
          }
          userMenuOptions.previousMenuMessageId.delete(previousMenu);
        }
      }

      if (ctx.update?.callback_query && ctx.update?.callback_query?.message) {
        const messageId = ctx.update.callback_query?.message?.message_id;
        if (messageId) {
          const chatId: number = ctx.chat?.id;
          if (chatId) {
            try {
              await ctx.api.deleteMessage(chatId, messageId);
            } catch (error: any) {
              if (error.error_code === 400 && error.description === "Bad Request: message to delete not found") {
                console.log(`Message already deleted, skipping deletion`);
                await this.updateMenu(ctx, "Main Menu");
                return;
              } else {
                console.log("Error deleting reply message:");
              }
            }
          }
        }
      }
      await screenshotStorage.addUser(userId, username);
      await screenshotStorage.setServiceOption(userId, null);
      await screenshotStorage.setPaymentOption(userId, null);
      await screenshotStorage.setPaymentType(userId, null);
      await this.updateMenu(ctx, "Main Menu");
      this.userMenuOptions.set(userId, userMenuOptions);
    } catch (error) {
      console.log(error);
      ctx.reply("An error occurred while going to main menu.");
    }
  }

  getFAQIndex(userId: number): number | null {
    const userMenuOptions = this.userMenuOptions.get(userId);
    return userMenuOptions ? userMenuOptions.faqIndex : null;
  }

  setFAQIndex(userId: number, index: number): void {
    const userMenuOptions = this.userMenuOptions.get(userId);
    if (userMenuOptions) {
      userMenuOptions.faqIndex = index;
      this.userMenuOptions.set(userId, userMenuOptions);
    }
  }

  async updateMenu(ctx: any, options: any): Promise<void> {
    try {
      const userId: number = ctx?.chat?.id;
      
      // ✅ Safety Check: Ensure userMenuOptions exists before using it.
      let userMenuOptions = this.userMenuOptions.get(userId);
      if (!userMenuOptions) {
        console.log(`Initializing menu options for new user: ${userId}`);
        userMenuOptions = {
          stack: [],
          previousMenuMessageId: new Map<string, number>(),
          faqIndex: 0,
          inviteLinkId: null,
        };
        this.userMenuOptions.set(userId, userMenuOptions);
      }

      const currentOption = userMenuOptions.stack[userMenuOptions.stack.length - 1];
      
      const chatInfo = await ctx.api.getChat(ctx.chat?.id);
      this.menuMessageId = chatInfo.last_message?.message_id ?? null;

      let optionStr: string;
      if (typeof options === "object" && options.option) {
        optionStr = options.option;
      } else {
        optionStr = options;
      }
      if (currentOption !== optionStr && !userMenuOptions.stack.includes(optionStr)) {
        userMenuOptions.stack.push(optionStr);
      }
      if (userMenuOptions.stack.length > 1) {
        const previousOption = userMenuOptions.stack[userMenuOptions.stack.length - 2];
        const prevMenuMsgId = userMenuOptions.previousMenuMessageId.get(previousOption);
        if (prevMenuMsgId) {
          try {
            await ctx.api.deleteMessage(ctx.chat.id, prevMenuMsgId);
            userMenuOptions.previousMenuMessageId.delete(previousOption);
          } catch (error: any) {
            if (error.error_code === 400 && error.description === "Bad Request: message to delete not found") {
              console.log("Message already deleted, skipping deletion");
            } else {
              console.log("Error deleting reply message:");
            }
          }
        }
      }
      const messageText =
        groupInfo[optionStr] ??
        `<code>     </code><b>${optionStr} section!</b><code>     </code>`;
      
      // ✅ Diagnostic Logging: See what data we're working with.
      console.log(`[updateMenu] User: ${userId}, Option: "${optionStr}"`);
      const menuLayout = getMenuOptions(optionStr, userId);
      console.log(`[updateMenu] Fetched Menu Layout:`, JSON.stringify(menuLayout, null, 2));
      
      const keyboard = generateInlineKeyboard(menuLayout);
      console.log(`[updateMenu] Generated Keyboard:`, JSON.stringify(keyboard, null, 2));

      // Safety check for empty keyboard
      if (!keyboard || keyboard.length === 0) {
        console.warn(`[updateMenu] Warning: Generated an empty keyboard for option "${optionStr}". Sending message without buttons.`);
      }

      const replyMarkup = {
        inline_keyboard: keyboard,
      };

      if (this.menuMessageId) {
        await ctx.api.editMessageText(ctx.chat.id, this.menuMessageId, messageText, {
          reply_markup: replyMarkup,
          parse_mode: "HTML",
        });
      } else {
        const message = await ctx.reply(messageText, {
          reply_markup: replyMarkup,
          parse_mode: "HTML",
        });
        this.menuMessageId = message.message_id;
        userMenuOptions.previousMenuMessageId.set(optionStr, message.message_id);

        const MenuOptions: string[] = [
          "USDT",
          "BTC",
          "Foreign Payment",
          "Naira Payment",
          "Check Subscription Status",
          "Ethereum Payment",
        ];
        const qickMenuOptions: string[] = [
          "Generate Coupon",
          "Gift Coupon",
          "Generate Code",
        ];
        if (MenuOptions.includes(optionStr)) {
          setTimeout(async () => {
            try {
              await ctx.api.deleteMessage(message.chat.id, message.message_id);
            } catch (error) {
              console.error("Error deleting reply message:");
            }
          }, 5000);
        } else if (qickMenuOptions.includes(optionStr)) {
          await ctx.api.deleteMessage(message.chat.id, message.message_id);
          console.log("Hi", qickMenuOptions);
        }
      }
      this.userMenuOptions.set(userId, userMenuOptions);
      if (optionStr !== "Main Menu") {
        this.menuMessageId = null;
      }
    } catch (error) {
      console.log("❌ DETAILED ERROR in updateMenu:", error); // ✅ More detailed error logging
      ctx.reply("An error occurred while updating the menu.");
    }
  }

  async deleteUserFromStack(userId: number): Promise<void> {
    this.userMenuOptions.delete(userId);
    console.log(`User with ID ${userId} has been deleted from the stack`);
  }

  async getUniqueUserData(): Promise<any[]> {
    const uniqueUserData: any[] = [];
    for (const [userId, userMenuOptions] of this.userMenuOptions.entries()) {
      const userData = {
        userId,
        stack: userMenuOptions.stack,
        previousMenuMessageId: await userMenuOptions.previousMenuMessageId.get("Vip Signal"),
      };
      const existingUser = uniqueUserData.find((user) => user.userId === userId);
      if (!existingUser) {
        uniqueUserData.push(userData);
      }
    }
    return uniqueUserData;
  }

  updateCallbackInfo(ctx: any, option: string, messageId: number): void {
    const userId = ctx.from.id;
    const userMenuOptions = this.userMenuOptions.get(userId);
    if (userMenuOptions) {
      userMenuOptions.previousMenuMessageId.set(option, messageId);
    } else {
      this.userMenuOptions.set(userId, {
        stack: [],
        previousMenuMessageId: new Map([[option, messageId]]),
        inviteLinkId: null,
        faqIndex: 0,
      });
    }
  }

  async performMaintenance(ctx: any): Promise<void> {
    if (maintenanceInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return;
    }

    maintenanceInProgress = true;

    const messageIds: { userId: number; messageId: number }[] = [];

    // Send message to all users
    for (const [userId] of this.userMenuOptions) {
      console.log(`Sending message to user ${userId}`);
      const messageText =
        "Dear valued user, 🤖\n\nWe're performing scheduled maintenance in 10 sec. Please excuse any inconvenience. You'll be returned to the main menu shortly. Thank you for your patience! 🙏\n\nIf you encounter any errors, please restart the bot. We apologize for any inconvenience.";
      const message = await ctx.api.sendMessage(userId, messageText);
      console.log(`Message sent with ID ${message.message_id}`);
      messageIds.push({ userId, messageId: message.message_id });
    }

    // Clear storage and delete message after 3 seconds (simulated maintenance period)
    setTimeout(async () => {
      try {
        console.log("Start clearing storage...");
        this.userMenuOptions.clear();
        await screenshotStorage.clearAllScreenshots();
        console.log("Storage clear done!");
      } catch (error) {
        console.log(`Error clearing storage: ${error}`);
      } finally {
        for (const { userId, messageId } of messageIds) {
          try {
            await ctx.api.deleteMessage(userId, messageId);
          } catch (error) {
            await ctx.api.sendMessage(
              userId,
              "Error: Unable to delete message. Please try again later."
            );
          }
        }
        await this.getUniqueUserData();
        maintenanceInProgress = false;
      }
    }, 3000);
  }

  async getSingleUserMenu(userId: number): Promise<any> {
    const userMenuOptions = this.userMenuOptions.get(userId);
    if (!userMenuOptions) {
      throw new Error(`User menu options not found for userId: ${userId}`);
    }
    const userMenuData = {
      userId,
      stack: userMenuOptions.stack,
      previousMenuMessageId: Object.fromEntries(userMenuOptions.previousMenuMessageId),
      inviteLinkId: null,
    };
    return userMenuData;
  }

  async addAllUsersToMenu(users: any[]): Promise<void> {
    if (!Array.isArray(users)) {
      throw new Error("Invalid users array");
    }
    try {
      for (const user of users) {
        const userId = user.userId;
        if (typeof user?.userId !== "number" && typeof user?.userId !== "string") {
          throw new Error(`User ID must be a number or string: ${user.userId}`);
        }
        if (!this.userMenuOptions.has(userId)) {
          this.userMenuOptions.set(userId, {
            stack: user.stack,
            previousMenuMessageId: new Map(Object.entries(user.previousMenuMessageId)),
            inviteLinkId: user.inviteLinkId,
            faqIndex: user.faqIndex || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error adding users to menu:", error);
    }
  }
}