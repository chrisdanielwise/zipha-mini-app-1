import CatchMechanismClass from "src/lib/zipha_bot/models/catchMechanismClass";
import { Context } from "grammy";
import mongoose from "mongoose";
import { Navigation } from "../../../navigation/navigationClass";
import userModel from "src/lib/zipha_bot/models/user.model";
import { retryApiCall } from "src/lib/zipha_bot/config/utilities";
import screenshotStorage from "../../../navigation/screenshotStorageClass";
import { UserInfo } from "src/lib/zipha_bot/models/userManagementClass";

type SubscriptionStatus = 'active' | 'expired' | 'inactive' | 'pending' | 'left';
type SubscriptionType = 'one_month' | 'three_months' | 'six_months' | 'twelve_months';


const vipChannelId = Number(process.env.VIP_SIGNAL_ID);
const catchMechanismClassInstance = CatchMechanismClass?.getInstance(mongoose.connection);
export async function handleChatMember(ctx: Context) {
  try {
   
   // First, ensure the channel ID matches the expected VIP channel.
    if (Number(ctx.update.chat_member?.chat?.id) !== Number(vipChannelId)) return;

    // Ensure that the chat member update exists.
    const chatMemberUpdate = ctx.update.chat_member;
    if (!chatMemberUpdate) {
      console.log("ctx.update.chat_member is null or undefined");
      return;
    }

    // Destructure the update, renaming invite_link to avoid conflicts.
    const {
      new_chat_member: newChatMember,
      old_chat_member: oldChatMember,
      chat,
      invite_link: inviteLinkObj,
    } = chatMemberUpdate;

    // Make sure new_chat_member exists.
    if (!newChatMember) {
      console.log("new_chat_member is missing");
      return;
    }

    // Retrieve userId and ensure it's valid, and that the user is not a bot.
    const userId: number = newChatMember.user.id;
    if (!userId || newChatMember.user.is_bot) return;

    // Build fullName using nullish coalescing (defaulting to empty strings).
    const fullName: string = `${newChatMember.user.first_name ?? ""} ${newChatMember.user.last_name ?? ""}`.trim();
    // Provide a default empty string for username if missing.
    const username: string = newChatMember.user.username ?? "";

    // Ensure that chat and chat.id exist.
    if (!chat || !chat.id) {
      console.log("Chat data is missing");
      return;
    }
    const chatId: number = chat.id;

    // Retrieve statuses.
    const newMemberStatus = newChatMember.status;
    const oldMemberStatus = oldChatMember.status;

    // Retrieve the invite link string from inviteLinkObj.
    const inviteLink: string | undefined = inviteLinkObj?.invite_link;

    // Get the Navigation instance.
    const navigation = Navigation.getInstance();

    // Find the existing user in your database.
    const existingUser = await userModel.findOne({ userId });

    // Retrieve user menu options from the navigation instance.
    const userMenuOptions = navigation.userMenuOptions.get(userId);
    const inviteLinkId = userMenuOptions?.inviteLinkId;

    if (newMemberStatus === "member" && oldMemberStatus === "left") {
      if (!existingUser) {
        await ctx.api.sendMessage(userId, "You don't have an active subscription.");
        await ctx.api.unbanChatMember(chatId, userId);
        console.log(`User ${userId} removed from group.`);
        return;
      }

      if (inviteLinkId) {
        setTimeout(async () => {
          await retryApiCall(() => ctx.api.deleteMessage(userId, inviteLinkId));
          await navigation.deleteUserFromStack(userId);
          await screenshotStorage.removeUser(userId);
          await catchMechanismClassInstance.removeCatchMechanism(userId);
        }, 5000);
      }

      if (existingUser) {
        await handleExistingUser(ctx, existingUser, userId, chatId);
      } else {
        await handleNewUser(ctx, userId, chatId, inviteLink,fullName,username,existingUser);
      }
    } else if (newMemberStatus === "left" && oldMemberStatus === "member") {
      if (existingUser?.inviteLink?.link) {
        try {
          await ctx.api.revokeChatInviteLink(chatId, existingUser.inviteLink.link);
          await ctx.api.sendMessage(
            userId,
            "<i>Your subscription has expired because you left the channel. You will not have access until you renew your package.</i>",
            { parse_mode: "HTML" }
          );
          await UserInfo.updateUser(existingUser.userId, {
            "groupMembership.groupId": null,
            "groupMembership.joinedAt": null,
            "subscription.status": "left",
          });
        } catch (error: any) {
          if (error.description === "INVITE_HASH_EXPIRED") {
            console.log("Invite link has already been revoked or expired.");
          } else {
            console.error("Error revoking invite link:", error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in handleChatMember:", error);
  }
}

async function handleExistingUser(ctx: Context, existingUser: any, userId: number, chatId: number) {

  const invalidStatuses: SubscriptionStatus[] = ['expired', 'inactive', 'left'];
  const validSubscriptionTypes: SubscriptionType[] = ['one_month', 'three_months', 'six_months', 'twelve_months'];
  if (invalidStatuses.includes(existingUser.subscription.status)) {
    await ctx.api.sendMessage(userId, "Your subscription has expired or is inactive. Please renew before joining.");
    await ctx.api.unbanChatMember(chatId, userId);
    return;
  } else if (existingUser.subscription.status === "pending") {
    if (!validSubscriptionTypes.includes(existingUser.subscription.type)) {
      await ctx.api.sendMessage(userId, `Invalid subscription type ${existingUser.subscription.type}. Please contact support.`);
      await ctx.api.unbanChatMember(chatId, userId);
      return;
    }
    await UserInfo.updateUser(existingUser.userId, {
      "groupMembership.groupId": chatId,
      "groupMembership.joinedAt": new Date(),
      "subscription.status": "active",
    });
  }
}

async function handleNewUser(ctx: Context, userId: number, chatId: number, inviteLink: string | undefined,fullName:string,username:string,existingUser:any) {
  const userWithSameLink = await userModel.findOne({ "inviteLink.link": inviteLink });
  const invalidStatuses: SubscriptionStatus[] = ['expired', 'inactive', 'left'];
  const validSubscriptionTypes: SubscriptionType[] = ['one_month', 'three_months', 'six_months','twelve_months'];

  if (userWithSameLink) {
    if (invalidStatuses.includes(userWithSameLink.subscription.status)) {
      await ctx.api.sendMessage(userId, "Your subscription has expired or is inactive. Please renew before joining.");
      await ctx.api.unbanChatMember(chatId, userId);
      return;
    } else if (userWithSameLink.subscription.status === "pending") {
      if (!validSubscriptionTypes.includes(userWithSameLink.subscription.type)) {
        await ctx.api.sendMessage(userId, `Invalid subscription type ${userWithSameLink.subscription.type}. Please contact support.`);
        await ctx.api.unbanChatMember(chatId, userId);
        return;
      }
      await UserInfo.updateUser(existingUser.userId, {
        'fullName': fullName,
        'username': username,
        'groupMembership.groupId': chatId,
        'groupMembership.joinedAt': new Date(),
        'subscription.status': 'active',
      });
    }
  }
}