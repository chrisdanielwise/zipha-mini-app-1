export class UserInfo {
  public userId: number;
  public username: string;
  public firstName: string;
  public lastName: string;
  public subscriptionStatus: string;
  public subscriptionType: string;
  public expirationDate?: number;

  constructor(userData: any) {
    this.userId = userData.userId || userData.id;
    this.username = userData.username || "";
    this.firstName = userData.firstName || userData.first_name || "";
    this.lastName = userData.lastName || userData.last_name || "";
    this.subscriptionStatus = userData.subscriptionStatus || "inactive";
    this.subscriptionType = userData.subscriptionType || "";
    this.expirationDate = userData.expirationDate;
  }

  public isSubscribed(): boolean {
    return this.subscriptionStatus === "active";
  }

  public isExpired(): boolean {
    if (!this.expirationDate) return false;
    return Date.now() > this.expirationDate;
  }

  public updateSubscription(status: string, type: string, expiration?: number): void {
    this.subscriptionStatus = status;
    this.subscriptionType = type;
    if (expiration) {
      this.expirationDate = expiration;
    }
  }
} 