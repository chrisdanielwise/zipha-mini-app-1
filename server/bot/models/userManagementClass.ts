import fs from "fs";
import { Context } from "grammy";
import { getGreybot } from "../config/initBot";
import path from "path";
import userModel from "./user.model";

const ADMIN_ID: string | undefined = process.env.ADMIN_ID;
const skipUpdateOptions: string[] = [
    "one_on_one_price_list",
    "mentorship_price_list",
    "$10,000 - $49,000",
    "$50,000 - $1 million",
    "bootcamp_payment"
];

interface Subscription {
    type: string | null;
    expirationDate: number | null;
    status: string | null;
}

interface InviteLink {
    link: string | null;
    name: string | null;
}

interface GroupMembership {
    joinedAt: Date | null;
    groupId: number | null;
}

interface UserData {
    userId: number | null;
    username: string | null;
    fullName: string | null;
    subscription: Subscription;
    inviteLink: InviteLink;
    groupMembership: GroupMembership;
}

class UserInfo {
    static allUsers: UserInfo[] = []; // Store all instances

    static defaultValues: UserData = {
        userId: null,
        username: null,
        fullName: null,
        subscription: {
            type: null,
            expirationDate: null,
            status: null,
        },
        inviteLink: {
            link: null,
            name: null,
        },
        groupMembership: {
            joinedAt: null,
            groupId: null,
        },
    };

    userId: number | null;
    username: string | null;
    fullName: string | null;
    subscription: Subscription;
    inviteLink: InviteLink;
    groupMembership: GroupMembership;

    constructor(data: Partial<UserData>) {
        this.userId = data?.userId ?? null;
        this.username = data?.username ?? null;
        this.fullName = data?.fullName ?? null;
        this.subscription = {
            type: data.subscription?.type ?? null,
            expirationDate: data.subscription?.expirationDate ?? null,
            status: data.subscription?.status ?? null,
        };
        this.inviteLink = {
            link: data.inviteLink?.link ?? null,
            name: data.inviteLink?.name ?? null,
        };
        this.groupMembership = {
            joinedAt: data.groupMembership?.joinedAt ?? null,
            groupId: data.groupMembership?.groupId ?? null,
        };
        UserInfo.allUsers.push(this);
    }

    async addMultipleUsers(usersData: any[]): Promise<void> {
        if (!Array.isArray(usersData)) {
            throw new Error("Invalid users data");
        }
        try {
            for (const userData of usersData) {
                this.updateData(userData);
            }
        } catch (error: any) {
            console.error(`Error adding users: ${error.message}`);
            throw error;
        }
    }

    static getAllUsersData(): UserInfo[] {
        return UserInfo.allUsers;
    }

    static getUserById(userId: number): UserInfo | undefined {
        if (!UserInfo.allUsers) {
            throw new Error("User data not initialized");
        }
        return UserInfo.allUsers.find((user) => user.userId === userId);
    }

    setUserProperties(userId: number, username: string, ctx: Context): void {
        this.userId = userId;
        this.username = username;
        this.fullName = `${ctx.from?.first_name} ${ctx.from?.last_name}`;
    }

    // resetUserInfo() {
    //   Object.assign(this, UserInfo.defaultValues);
    // }
    resetUserInfo(): void {
        this.userId = null;
        this.username = null;
        this.fullName = null;
        this.subscription = {
            type: null,
            expirationDate: null,
            status: null,
        };
        this.inviteLink = {
            link: null,
            name: null,
        };
        this.groupMembership = {
            joinedAt: null,
            groupId: null,
        };
    }

    updateData(newData: Partial<UserData>): void {
        const {
            userId,
            username,
            fullName,
            subscription = {},
            inviteLink = {},
            groupMembership = {},
        } = newData ?? {};

        this.userId = userId || this.userId;
        this.username = username || this.username;
        this.fullName = fullName || this.fullName;

        this.subscription = {
            type: (subscription as Subscription).type || this.subscription.type,
            expirationDate:
                (subscription as Subscription).expirationDate || this.subscription.expirationDate,
            status: (subscription as Subscription).status || this.subscription.status,
        };

        this.inviteLink = {
            link: (inviteLink as InviteLink).link || this.inviteLink.link,
            name: (inviteLink as InviteLink).name || this.inviteLink.name,
        };

        this.groupMembership = {
            joinedAt: (groupMembership as GroupMembership).joinedAt || this.groupMembership.joinedAt,
            groupId: (groupMembership as GroupMembership).groupId || this.groupMembership.groupId,
        };
    }

    setExpirationDate(expirationDate: number): void {
        this.subscription.expirationDate = expirationDate;
    }

    subscriptionStatus(status: string): void {
        this.subscription.status = status;
    }

    subscribe(type: string): void {
        this.subscription.type = type;
    }

    getSubscriptionType(): string | null {
        return this.subscription.type;
    }

    storeUserLink(link: string, name: string): void {
        this.inviteLink.link = link;
        this.inviteLink.name = name;
    }

    getUserLink(): InviteLink {
        return this.inviteLink;
    }

    getUserSubscription(): Subscription {
        return this.subscription;
    }

    leaveGroup(): void {
        this.groupMembership.groupId = null;
        this.groupMembership.joinedAt = null;
    }

    async saveUserToDB(): Promise<void> {
        try {
            const existingUser = await userModel.findOne({ userId: this.userId });
            let skipUpdate = false;

            if (existingUser) {
                if (existingUser.subscription.status === "active") {
                    this.subscription.status = "active";
                    console.log("User status is active, skipping database update.");
                    skipUpdate = true;
                } else if (existingUser.subscription.status === "expired") {
                    this.subscription.status = "expired";
                    console.log("User status is expired, skipping database update.");
                    skipUpdate = true;
                }
            }

            if (skipUpdate) {
                console.log("Skipping database update...");
                return;
            }

            const userData: UserData = {
                userId: this.userId,
                username: this.username,
                fullName: this.fullName,
                subscription: this.subscription,
                inviteLink: this.inviteLink,
                groupMembership: this.groupMembership,
            };

            await userModel.findOneAndUpdate(
                { userId: this.userId },
                { $set: userData },
                { new: true, upsert: true }
            );
        } catch (error: any) {
            console.error("Error saving user to DB:", error);

            const systemInfo = `        Error Message: Failed to update user info        Error Details: ${error.message}        User Details:         ${JSON.stringify({ userId: this.userId, username: this.username, fullName: this.fullName, subscription: this.subscription, groupMembership: this.groupMembership, inviteLink: this.inviteLink, }, null, 2)}      `;
            await getGreybot().api.sendMessage(ADMIN_ID!, systemInfo);
        }
    }

   // Inside UserInfo class (as an instance method)
    async getSubscriptionInfo(): Promise<{ type: string; expirationDate: Date; status: string } | null> {
    return userModel.findOne({ userId: this.userId}).then((user: any) => {
      if (user) {
        return {
          type: user.subscription.type,
          expirationDate: user.subscription.expirationDate,
          status: user.subscription.status,
        };
      } else {
        return null;
      }
    });
  }
  

    static getAllUsers() {
        return userModel.find()
            .then((users: any[]) => {
                const userList = users.map((user) => ({
                    id: user._id,
                    userId: user.userId,
                    username: user.username,
                    fullName: user.fullName,
                    subscription: {
                        type: user.subscription.type,
                        expirationDate: user.subscription.expirationDate,
                        status: user.subscription.status,
                    },
                    inviteLink: {
                        link: user?.inviteLink?.link,
                        name: user?.inviteLink?.name,
                    },
                    groupMembership: {
                        groupId: user.groupMembership.groupId,
                        joinedAt: user.groupMembership.joinedAt,
                    },
                }));

                const filePath = path.join(__dirname, "users.json");
                fs.writeFileSync(filePath, JSON.stringify(userList, null, 2), "utf-8");
                console.log("User data successfully written to users.json");
                return userList;
            })
            .catch((err: any) => { console.error("Error fetching users:", err); throw err; });
    }

    static findDuplicateUsersByFullName() {
        const filePath = path.join(__dirname, "users.json");
        const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const fullNameCountMap: Record<string, boolean> = {};
        const duplicates: any[] = [];
        users.forEach((user: any) => {
            const fullName = user.fullName;
            if (!fullName) return;
            if (fullNameCountMap[fullName]) {
                duplicates.push(user);
            } else {
                fullNameCountMap[fullName] = true;
            }
        });
        if (duplicates.length > 0) {
            console.log("Duplicate users found:", duplicates);
        } else { console.log("No duplicate users found."); } return duplicates;
    }

    static async updateUser(userId: number, updateData: any) { try { const user = await userModel.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, upsert: true }); return user; } catch (error) { console.error(error); return null; } }

    async getUserManagementData(userId: number) { if (this.userId !== userId) { throw new Error(`User ID mismatch: Expected ${this.userId} but received ${userId}`); } return { userId: this.userId, username: this.username, fullName: this.fullName, subscription: this.subscription, inviteLink: this.inviteLink, groupMembership: this.groupMembership, }; }
}

export { UserInfo };