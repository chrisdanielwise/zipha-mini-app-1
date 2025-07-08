import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

export function getUserModel(connection: mongoose.Connection) {
  return connection.models.User || connection.model("User", userSchema);
}
