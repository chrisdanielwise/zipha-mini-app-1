import mongoose from "mongoose";

interface CatchMechanismDocument extends mongoose.Document {
  userId: number;
  userMenu: any;
  userManagement: any;
  screenshotStorage: any;
  messageId?: number;
  channelMessageId?: number;
  paymentMessageId?: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const catchMechanismSchema = new mongoose.Schema<CatchMechanismDocument>({
  userId: { type: Number, required: true, unique: true },
  userMenu: { type: mongoose.Schema.Types.Mixed, default: {} },
  userManagement: { type: mongoose.Schema.Types.Mixed, default: {} },
  screenshotStorage: { type: mongoose.Schema.Types.Mixed, default: {} },
  messageId: { type: Number },
  channelMessageId: { type: Number },
  paymentMessageId: { type: Number },
  status: { type: String, default: "pending" }
}, {
  timestamps: true
});


const CatchMechanism = mongoose.models.CatchMechanism || mongoose.model<CatchMechanismDocument>("CatchMechanism", catchMechanismSchema);
export default CatchMechanism; 