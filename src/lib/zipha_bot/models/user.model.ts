import mongoose, { Schema, model, Document } from "mongoose";

interface Subscription {
  type: string;
  expirationDate: number; // Stored as timestamp (milliseconds)
  status: string;
}

interface InviteLink {
  link: string;
  name: string;
}

interface GroupMembership {
  groupId: number;
  joinedAt: Date;
}

interface IUser extends Document {
  userId: number;
  username?: string;
  fullName?: string;
  subscription?: Subscription;
  inviteLink?: InviteLink;
  groupMembership?: GroupMembership;
}

const UserSchema = new Schema<IUser>({
  userId: { type: Number, unique: true, required: true },
  username: { type: String },
  fullName: { type: String },
  subscription: {
    type: Object,
    default: {},
  },
  inviteLink: {
    type: Object,
    default: {},
  },
  groupMembership: {
    type: Object,
    default: {},
  },
});

// ✅ Use `mongoose.models` instead of `models`
// const User =

export default  mongoose.models["telegram-bot-users"] || model<IUser>("telegram-bot-users", UserSchema);