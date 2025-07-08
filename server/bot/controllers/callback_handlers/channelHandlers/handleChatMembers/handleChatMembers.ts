import { Context } from "grammy";

export async function handleChatMember(ctx: Context) {
  try {
    console.log("Chat member update received:", ctx.chatMember);
    // Handle chat member update logic here
  } catch (error) {
    console.error("Error handling chat member update:", error);
  }
} 