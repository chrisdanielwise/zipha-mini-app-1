import { UserInfo } from "./userManagementClass";

export function createUserInstance(userData: any): UserInfo {
  return new UserInfo(userData);
}

export class UserInfoSingleton {
  private static instance: UserInfoSingleton;
  private users: Map<string, UserInfo> = new Map();

  private constructor() {}

  public static getInstance(): UserInfoSingleton {
    if (!UserInfoSingleton.instance) {
      UserInfoSingleton.instance = new UserInfoSingleton();
    }
    return UserInfoSingleton.instance;
  }

  public getUser(userId: string): UserInfo | undefined {
    return this.users.get(userId);
  }

  public setUser(userId: string, userInfo: UserInfo): void {
    this.users.set(userId, userInfo);
  }

  public removeUser(userId: string): void {
    this.users.delete(userId);
  }

  public clear(): void {
    this.users.clear();
  }

  async addMultipleUsers(users: any[]): Promise<void> {
    try {
      console.log(`Adding ${users.length} users to user management`);
      for (const user of users) {
        if (user && user.userId) {
          const userInfo = new UserInfo(user);
          this.users.set(String(user.userId), userInfo);
        }
      }
    } catch (error) {
      console.error("Error adding multiple users:", error);
    }
  }

  async getUserManagementData(userId: number): Promise<any> {
    try {
      const user = this.users.get(String(userId));
      return user || {
        userId: userId,
        username: "",
        firstName: "",
        lastName: "",
        subscriptionStatus: "inactive",
        subscriptionType: "",
        expirationDate: null
      };
    } catch (error) {
      console.error(`Error getting user management data for ${userId}:`, error);
      return null;
    }
  }

  subscribe(option: string): void {
    console.log(`User subscribed to: ${option}`);
    // Add subscription logic here
  }

  setExpirationDate(expirationDate: number): void {
    console.log(`Setting expiration date: ${expirationDate}`);
    // Add expiration date logic here
  }

  getUserSubscription(): any {
    console.log("Getting user subscription");
    return {
      status: "inactive",
      type: "",
      expirationDate: null
    };
  }

  subscriptionStatus(status: string): void {
    console.log(`Setting subscription status: ${status}`);
    // Add subscription status logic here
  }

  setUserProperties(userId: number, username: string, ctx: any): void {
    console.log(`Setting user properties for ${userId}: ${username}`);
    // Add user properties logic here
  }

  async saveUserToDB(): Promise<void> {
    console.log("Saving user to database");
    // Add save to DB logic here
  }
}

const userInfoSingletonInstance = UserInfoSingleton.getInstance();
export { userInfoSingletonInstance }; 