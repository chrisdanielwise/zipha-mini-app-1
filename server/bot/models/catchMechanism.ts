import mongoose, { Schema, model, Document } from "mongoose";

// 1. ScreenshotData Interface
interface ScreenshotData {
  userId: string;
  username: string;
  photoIds: string[];
  messageIds: number[];
  messageIdCount: number;
  package: string;
  channelMessageIds: number[];
  paymentMessageIds: number[];
}

// 2. ScreenshotStorage Interface (updated to array)
interface ScreenshotStorage {
  userId: string;
  username: string;
  screenshots: ScreenshotData[]; // ✅ updated
  paymentOption: string;
  paymentType: string;
  serviceOption: string;
  isExpired: boolean;
  isActive: boolean;
}

// 3. Subscription Info
interface Subscription {
  type: string;
  expirationDate: number; // Timestamp in milliseconds
  status: string;
}

// 4. Invite Link Info
interface InviteLink {
  link: string;
  name: string;
}

// 5. Group Membership Info
interface GroupMembership {
  groupId: number;
  joinedAt: Date;
}

// 6. User Management Info
interface UserManagement {
  userId: number;
  username: string;
  fullName: string;
  subscription: Subscription;
  inviteLink: InviteLink;
  groupMembership: GroupMembership;
}

// 7. User Menu Info
interface UserMenu {
  userId: number;
  stack: string[];
  previousMenuMessageId: object;
  inviteLinkId?: number | null;
}

// 8. MongoDB Document Structure
interface CatchMechanismDocument extends Document {
  userId: number;
  userMenu: UserMenu;
  userManagement: UserManagement;
  screenshotStorage: ScreenshotStorage;
}

// 9. Mongoose Schema
const catchMechanismSchema = new Schema<CatchMechanismDocument>({
  userId: { type: Number, unique: true, required: true },

  userMenu: {
    type: Object,
    required: true,
    default: {},
  },

  userManagement: {
    type: Object,
    required: true,
    default: {},
  },

  screenshotStorage: {
    type: Object,
    required: true,
    default: {},
  },
});

// 10. Export Mongoose Model
const CatchMechanism =
  mongoose.models.CatchMechanism ||
  model<CatchMechanismDocument>("CatchMechanism", catchMechanismSchema);

export default CatchMechanism;