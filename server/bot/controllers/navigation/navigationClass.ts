import { Context } from "grammy";

interface UserMenuOptions {
  stack: any[];
  previousMenuMessageId: Map<string, number>;
  inviteLinkId?: number | null;
  faqIndex: number;
}

export class Navigation {
  public userMenuOptions: Map<number, UserMenuOptions>;
  public menuMessageId: number | null;
  public uniqueUser: number | null;
  public nairaPrice: any;
  private static instance: Navigation;

  private constructor() {
    this.userMenuOptions = new Map<number, UserMenuOptions>();
    this.menuMessageId = null;
    this.uniqueUser = null;
    this.nairaPrice = null;
  }

  public static getInstance(): Navigation {
    if (!Navigation.instance) {
      Navigation.instance = new Navigation();
    }
    return Navigation.instance;
  }

  public async handleNavigation(ctx: Context) {
    try {
      console.log("Navigation handled for user:", ctx.from?.id);
      // Navigation logic here
    } catch (error) {
      console.error("Error handling navigation:", error);
    }
  }

  async navigate(ctx: Context, option: any, callback: any = null): Promise<void> {
    // Navigation logic
    console.log(`Navigating to: ${option}`);
  }

  async goBack(ctx: Context): Promise<void> {
    // Go back logic
    console.log("Going back...");
  }

  async goToMainMenu(ctx: Context): Promise<void> {
    // Go to main menu logic
    console.log("Going to main menu...");
  }

  updateCallbackInfo(ctx: any, option: string, messageId: number): void {
    // Update callback info logic
    console.log(`Updating callback info: ${option}`);
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

  // Add missing methods
  async addAllUsersToMenu(users: any[]): Promise<void> {
    try {
      console.log(`Adding ${users.length} users to menu`);
      // Implementation for adding users to menu
      for (const user of users) {
        if (user && user.userId) {
          this.userMenuOptions.set(user.userId, {
            stack: user.stack || [],
            previousMenuMessageId: new Map(),
            inviteLinkId: user.inviteLinkId || null,
            faqIndex: user.faqIndex || 0
          });
        }
      }
    } catch (error) {
      console.error("Error adding users to menu:", error);
    }
  }

  async getSingleUserMenu(userId: number): Promise<any> {
    try {
      const userMenu = this.userMenuOptions.get(userId);
      return userMenu || {
        stack: [],
        previousMenuMessageId: new Map(),
        inviteLinkId: null,
        faqIndex: 0
      };
    } catch (error) {
      console.error(`Error getting user menu for ${userId}:`, error);
      return null;
    }
  }

  async performMaintenance(bot: any): Promise<void> {
    try {
      console.log("Performing navigation maintenance...");
      // Add maintenance logic here if needed
    } catch (error) {
      console.error("Error during navigation maintenance:", error);
    }
  }
} 