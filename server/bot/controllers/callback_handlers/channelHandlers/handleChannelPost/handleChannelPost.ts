import { Context } from "grammy";

export async function handleChannelPost(ctx: Context) {
  try {
    console.log("Channel post received:", ctx.channelPost);
    // Handle channel post logic here
  } catch (error) {
    console.error("Error handling channel post:", error);
  }
} 