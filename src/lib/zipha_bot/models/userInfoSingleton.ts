import userDataSchema from "./user.data";
import { UserInfo } from "./userManagementClass";

let instance: UserInfo | null = null;

const userData = (data: any): UserInfo => {
  if (!data) {
    throw new Error("No data provided");
  }
  if (!instance) {
    instance = new UserInfo(data);
  } else {
    Object.assign(instance, data); // Update the existing instance with new data
  }
  return instance;
};

const createUserInstance = userData(userDataSchema);

export { createUserInstance };
