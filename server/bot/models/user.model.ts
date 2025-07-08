import mongoose from "mongoose";

interface UserDocument extends mongoose.Document {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  subscription: {
    status: string;
    type: string;
    expirationDate?: number;
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
  userId: { type: String, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String },
  subscription: {
    status: { type: String, default: "inactive" },
    type: { type: String },
    expirationDate: { type: Number }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const UserModel = mongoose.model<UserDocument>("telegram-bot-users", userSchema);

export default UserModel; 