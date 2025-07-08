import mongoose, { Schema, model, Document, Model } from "mongoose";

interface Option {
  callback_data: string;
  text: string;
}

interface CodeGeneration {
  couponId: string;
  username: string;
  options: Option[];
  redeemed: boolean;
  timestamps: Date;
  couponCode: string;
}

interface VipPrice {
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
}

interface Settings {
  language?: string;
  notificationPreferences?: boolean;
  nairaPrice?: number;
  vipPrice?: VipPrice;
  vipDiscountPrice?: VipPrice;
  codeGeneration?: CodeGeneration[];
}

export interface ISettingsDocument extends Document {
  userId: number;
  settings: Settings;
}

// Create a custom model type that extends Model<ISettingsDocument>
interface SettingsModel extends Model<ISettingsDocument> {}

const SettingsSchema = new Schema<ISettingsDocument>({
  userId: { type: Number, unique: true, required: true },
  settings: {
    language: { type: String, default: "en" },
    notificationPreferences: { type: Boolean, default: false },
    nairaPrice: { type: Number, default: 1700 },
    vipPrice: {
      oneMonth: { type: Number, default: 63 },
      threeMonths: { type: Number, default: 160 },
      sixMonths: { type: Number, default: 300 },
      oneYear: { type: Number, default: 500 },
    },
    vipDiscountPrice: {
      oneMonth: { type: Number, default: 63 },
      threeMonths: { type: Number, default: 160 },
      sixMonths: { type: Number, default: 300 },
      oneYear: { type: Number, default: 500 },
    },
    codeGeneration: [
      {
        couponId: { type: String, required: true },
        username: { type: String, required: true },
        options: [
          {
            callback_data: { type: String, required: true },
            text: { type: String, required: true },
          },
        ],
        redeemed: { type: Boolean, default: false },
        timestamps: { type: Date, default: Date.now },
        couponCode: { type: String, required: true },
      },
    ],
  },
});
  

export default mongoose.models.Settings ||
model<ISettingsDocument, SettingsModel>("Settings", SettingsSchema); 