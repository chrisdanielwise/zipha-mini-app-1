import { Context } from "grammy";

export const handleOptionAction = async (ctx: Context, action: string, data?: any) => {
  try {
    console.log(`Handling option action: ${action}`, data);
    
    // Handle different option actions
    switch (action) {
      case "subscribe":
        // Handle subscription action
        break;
      case "payment":
        // Handle payment action
        break;
      case "service":
        // Handle service action
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
    
  } catch (error) {
    console.error("Error in option action handler:", error);
    await ctx.reply("An error occurred while processing your request.");
  }
}; 