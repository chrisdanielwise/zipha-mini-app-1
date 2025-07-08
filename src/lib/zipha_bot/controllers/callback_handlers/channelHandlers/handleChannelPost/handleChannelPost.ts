import { Broadcast } from "src/lib/zipha_bot/controllers/navigation/broadcast_singleton";
import { Bot, Context, InlineKeyboard } from "grammy";
import screenshotStorage from "../../../navigation/screenshotStorageClass";

const expectedChannelId = [Number(process.env.APPROVAL_CHANNEL_ID)];
const expectedPostChannelId = [
  Number(process.env.PUBLIC_CHANNEL_ID),
  Number(process.env.VIP_SIGNAL_ID),
];

type BotApi = Bot["api"];

interface CustomContext extends Context {
  api: BotApi;
}

export async function handleChannelPost(ctx: CustomContext) {
  try {
   // Ensure ctx.me is defined before accessing id.
if (!ctx.me?.id) {
  throw new Error("Sender ID is missing");
}
const senderId: number = ctx.me.id;

// Convert environment variable to number.
const ADMIN_ID: number = Number(process.env.GREYBOT_ID);

// Ensure channel type is defined; if not, you might use a default.
const channelType: string = ctx.update.channel_post?.chat?.type ?? "unknown";

// Check that channel ID exists.
if (!ctx.update.channel_post?.chat?.id) {
  throw new Error("Channel ID is missing");
}
const channelId: number = ctx.update.channel_post.chat.id;

// For text values, you can use a default empty string if missing.
const appealMessage: string = ctx.update.channel_post?.text ?? "";

// For photos, you may leave it as-is if it's optional, or check further if needed.
const postPhoto = ctx.update.channel_post?.photo;

// For caption, provide a default if missing.
const postCaption: string = ctx.update.channel_post?.caption ?? "";

// Check that message ID exists.
if (!ctx.update.channel_post?.message_id) {
  throw new Error("Appeal message ID is missing");
}
const appealMessageId: number = ctx.update.channel_post.message_id;

// For environment variables, provide a default if needed.
const keyword: string = process.env.QUERY_KEY_WORD ?? "";

    const broadcast = Broadcast();

    
    function resetBroadcast() {
      broadcast.active = false;
      broadcast.message = null;
      broadcast.userId = {};
      broadcast.messageId = null;
    }
    
    if (channelType === "channel" && expectedPostChannelId.includes(channelId)) {
      const keyboard = new InlineKeyboard().url("CONTACT US", process.env.BOT_URL || "");

      const lowerCasePostMessage = appealMessage?.toLowerCase();
      const lowerCasePostCaption = postCaption?.toLowerCase();

      if (lowerCasePostMessage?.includes(keyword.toLowerCase())) {
        const updatedMessage = appealMessage.replace(keyword, " ");

        await ctx.api.deleteMessage(channelId, appealMessageId);
        await ctx.api.sendMessage(channelId, updatedMessage, {
          reply_markup: keyboard,
        });
      } else if (postPhoto && lowerCasePostCaption?.includes(keyword.toLowerCase())) {
        const updatedCaption = postCaption.trim().replace(keyword, " ");

        await ctx.api.deleteMessage(channelId, appealMessageId);
        await ctx.api.sendPhoto(channelId, postPhoto[0].file_id, {
          caption: updatedCaption,
          reply_markup: keyboard,
        });
      }
    }

    if (broadcast?.userId?.userID) {
      const { userID: userId, photoId, messageID: originalMessageId, action } = broadcast.userId;
      const isAdmin = senderId === ADMIN_ID;
      const isBroadcastActive = broadcast.active;
     
      if (!isAdmin || !isBroadcastActive) {
        console.error("Unauthorized or broadcast inactive");
        return;
      }

      if (channelType !== "channel" || !expectedChannelId.includes(channelId)) {
        console.error("Invalid channel type or ID");
        return;
      }

      const caption = `
<blockquote>${appealMessage}</blockquote>
<i>Please verify payment and send a screenshot again.</i>`;

      try {
        if (action === "appeal" && originalMessageId) {
          await sendPhotoAndDeleteOriginal(ctx, userId, photoId, caption, broadcast, channelId);

          setTimeout(async () => {
            await screenshotStorage.deleteAllScreenshotMessages(ctx, userId);
            resetBroadcast();
          }, 1000);
        }
      } catch (error) {
        console.error("Error processing appeal:", error);
        await sendErrorMessage(ctx, error);
      }
    } else {
      console.error("Invalid broadcast userId");
    }
  } catch (error) {
    console.error(`Error handling message: ${error}`);
    await sendErrorMessage(ctx, error);
  }
}

async function sendPhotoAndDeleteOriginal(
  ctx: CustomContext,
  userId: number,
  photoId: string,
  caption: string,
  broadcast: any,
  channelId: number
) {
  if (photoId) {
    try {
      await ctx.api.sendPhoto(userId, photoId, { caption, parse_mode: "HTML" });
    } catch (error) {
      console.error("Error sending photo:", error);
    }
    
  }
  await ctx.api.deleteMessage(broadcast.message.chat.id, broadcast.messageId);

  setTimeout(async () => {
    await ctx.api.deleteMessage(channelId, ctx.update.channel_post?.message_id || 0);
  }, 1000);

  const sendMessage = await ctx.reply("Message sent successfully.");
  if (sendMessage) {
    setTimeout(async () => {
      try {
        await ctx.api.deleteMessage(sendMessage.chat.id, sendMessage.message_id);
      } catch (deleteError) {
        console.error("Error deleting message:", deleteError);
      }
    }, 5000);
  }
}

async function sendErrorMessage(ctx: CustomContext, error: any) {
  const errorMessage = `Sorry, something went wrong. Please try again later. (Error: ${error.message})`;
  const replyMsg = await ctx.reply(errorMessage);

  setTimeout(async () => {
    try {
      await ctx.api.deleteMessage(replyMsg?.chat?.id, replyMsg.message_id);
    } catch (deleteError) {
      console.error("Error deleting reply message:", deleteError);
    }
  }, 5000);
}