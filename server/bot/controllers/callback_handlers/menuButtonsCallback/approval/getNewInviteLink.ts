import { Context } from "grammy";

export type AllowedOption = 
  | "mentorship_price_list"
  | "bootcamp_payment"
  | "one_month"
  | "three_months"
  | "six_months"
  | "twelve_months";

interface InviteLinkResult {
  invite_link: string;
  name: string;
}

export async function getNewInviteLink(
  ctx: Context,
  channelId: number,
  subscriptionType: AllowedOption
): Promise<InviteLinkResult> {
  try {
    // Create invite link for the channel
    const inviteLink = await ctx.api.createChatInviteLink(channelId, {
      name: `Subscription: ${subscriptionType}`,
      creates_join_request: false,
    });

    return {
      invite_link: inviteLink.invite_link,
      name: inviteLink.name || `Subscription: ${subscriptionType}`,
    };
  } catch (error) {
    console.error("Error creating invite link:", error);
    throw new Error("Failed to create invite link");
  }
} 