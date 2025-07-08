import mongoose from "mongoose";

interface SettingsDocument extends mongoose.Document {
  userId: string;
  nairaPrice: number;
  vipDiscountPrice: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  vipPrice: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new mongoose.Schema<SettingsDocument>({
  userId: { type: String, required: true, unique: true },
  nairaPrice: { type: Number, default: 1500 },
  vipDiscountPrice: {
    oneMonth: { type: Number, default: 99 },
    threeMonths: { type: Number, default: 299 },
    sixMonths: { type: Number, default: 599 },
    oneYear: { type: Number, default: 999 }
  },
  vipPrice: {
    oneMonth: { type: Number, default: 99 },
    threeMonths: { type: Number, default: 299 },
    sixMonths: { type: Number, default: 599 },
    oneYear: { type: Number, default: 999 }
  }
}, {
  timestamps: true
});

const SettingsModel = mongoose.model<SettingsDocument>("Settings", settingsSchema);

export default SettingsModel; 