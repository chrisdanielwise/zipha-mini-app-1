import { Document } from "mongoose";
import CatchMechanism from "./catchMechanism";
import { createUserInstance } from "./userInfoSingleton";
import { Navigation } from "../controllers/navigation/navigationClass";
import screenshotStorage from "../controllers/navigation/screenshotStorageClass";

const navigation = Navigation.getInstance();
export interface ICatchMechanism {
  userMenu: any;
  userManagement: any;
  screenshotStorage: any;
  // Optionally, add additional properties if needed, for example:
  // createdAt?: Date;
  // updatedAt?: Date;
}


class CatchMechanismClass {
  private static instance: CatchMechanismClass;
  private db: any;
  private collectionName: string;
  private CatchMechanismModel: typeof CatchMechanism;

  private constructor(db: any) {
    this.db = db;
    this.collectionName = "catchMechanism";
    this.CatchMechanismModel = CatchMechanism;
  }

  static getInstance(db: any): CatchMechanismClass {
    if (!CatchMechanismClass.instance) {
      CatchMechanismClass.instance = new CatchMechanismClass(db);
    }
    return CatchMechanismClass.instance;
  }

  async initialize(): Promise<void> {
    try {
      const users = await this.CatchMechanismModel.find({});
      await Promise.all(users.map((user) => this.updateUserCatchClasses(user)));
    } catch (error) {
      console.error("Error initializing user classes:", error);
    }
  }

  async storeUserData(userId: number, userData: Partial<ICatchMechanism>): Promise<void> {
    const user = new this.CatchMechanismModel({ userId, ...userData });
    await user.save();
  }

  async getUserData(userId: string): Promise<ICatchMechanism & Document> {
    try {
      const userData = await this.CatchMechanismModel.findOne({ userId });
      if (!userData) {
        throw new Error(`User data not found for ${userId}`);
      }
      return userData;
    } catch (error) {
      console.error(`Error retrieving user data for ${userId}:`, error);
      throw error;
    }
  }

  async updateUserService(userId: number, updates: Partial<ICatchMechanism>): Promise<void> {
    await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );
  }

  async addCatchMechanism(userId: number): Promise<ICatchMechanism | null> {
    try {
      const userMenuData = await navigation.getSingleUserMenu(userId);
      const userManagementData = await createUserInstance.getUserManagementData(userId);
      const screenshotStorageData = await screenshotStorage.getScreenshotStorageData(userId);

      const updates = {
        userMenu: userMenuData,
        userManagement: userManagementData,
        screenshotStorage: screenshotStorageData,
      };

      return await this.CatchMechanismModel.findOneAndUpdate(
        { userId },
        { $set: updates },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error(`Error updating user collective information for ${userId}:`, error);
      return null;
    }
  }

  async updateUserCatchClasses(user: ICatchMechanism): Promise<void> {
    await navigation.addAllUsersToMenu([user.userMenu]);
    await createUserInstance.addMultipleUsers([user.userManagement]);
    await screenshotStorage.addAllUsers([user.screenshotStorage]);
  }

  async removeUserManagementAndScreenshotStorage(userId: number): Promise<ICatchMechanism | null> {
    return await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $unset: { userManagement: 1, screenshotStorage: 1 } },
      { new: true }
    );
  }

  async removeCatchMechanism(userId: number): Promise<ICatchMechanism | null> {
    return await this.CatchMechanismModel.findOneAndDelete({ userId });
  }

  async addInviteLinkToCatchMechanism(userId: number, inviteLinkId: string): Promise<ICatchMechanism | null> {
    return await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $set: { "userMenu.inviteLinkId": inviteLinkId } },
      { new: true }
    );
  }

  async removeUserData(userId: number): Promise<void> {
    await this.CatchMechanismModel.findOneAndDelete({ userId });
  }

  async updateUserMenu(userId: number, userMenuUpdates: any): Promise<void> {
    await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $set: { userMenu: userMenuUpdates } },
      { new: true }
    );
  }

  async updateUserManagement(userId: SVGAnimatedNumber, userManagementUpdates: any): Promise<void> {
    await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $set: { userManagement: userManagementUpdates } },
      { new: true }
    );
  }

  async updateScreenshotStorage(userId: number, screenshotStorageUpdates: any): Promise<void> {
    await this.CatchMechanismModel.findOneAndUpdate(
      { userId },
      { $set: { screenshotStorage: screenshotStorageUpdates } },
      { new: true }
    );
  }

  async initializeCatchMechanisms(): Promise<void> {
    const catchMechanisms = await this.CatchMechanismModel.find({});
    const bulkWriteOperations = catchMechanisms.map((catchMechanism) => ({
      updateOne: {
        filter: { userId: catchMechanism.userId },
        update: {
          $set: {
            userMenu: catchMechanism.userMenu,
            userManagement: catchMechanism.userManagement,
            screenshotStorage: catchMechanism.screenshotStorage,
          },
        },
        upsert: true,
      },
    }));

    await this.CatchMechanismModel.bulkWrite(bulkWriteOperations);
  }
}

export default CatchMechanismClass;