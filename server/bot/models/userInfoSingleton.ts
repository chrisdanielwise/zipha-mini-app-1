// import userDataSchema from "./user.data";
import { UserInfo } from "./userManagementClass";

let instance: UserInfo | null = null;
const userDataSchema = {
    userId: null as number | null,
    username: null as string | null,
    fullName: null as string | null,
    subscription: {
      type: null as string | null,
      expirationDate: null as number | null,
      status: null as string | null,
    },
    inviteLink: {
      link: null as string | null,
      name: null as string | null,
    },
    groupMembership: {
      groupId: null as number | null,
      joinedAt: null as Date | null,
    },
  };
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