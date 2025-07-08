import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  subscriptionStatus: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive", "expired", "pending"]
  },
  subscriptionType: {
    type: String,
    default: ""
  },
  expirationDate: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel; 