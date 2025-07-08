
import { Connection } from "mongoose";
import UserSchema from "../schemas/userSchema";

// Function to get user model for a specific connection
export function getUserModel(connection: Connection) {
    return connection.models.User || connection.model("User",UserSchema);
  }
// const User = mongoose.models.User || mongoose.model("User", UserSchema);

