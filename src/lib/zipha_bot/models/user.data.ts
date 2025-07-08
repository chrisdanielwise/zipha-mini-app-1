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
  
  export default userDataSchema;  