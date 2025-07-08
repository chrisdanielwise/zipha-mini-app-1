import {  TelegramClient } from 'telegram';
import Bottleneck from 'bottleneck';
import { throttledInvoke } from './telegramClass';

// Bottleneck configuration (adjust limits as needed)
const limiter = new Bottleneck({
    minTime: 200, // Minimum time between requests (milliseconds) - Adjust!
    maxConcurrent: 5, // Maximum concurrent requests - Adjust!
  });
interface CreateBotInstanceResponse {
  success: boolean;
  message: string;
  token?: string;
  botLink?: string;
}

export async function createBotInstance(
  botName: string,
  botUsername: string,
  client: TelegramClient
): Promise<CreateBotInstanceResponse> {
  try {
    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/newbot",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessage = messagesResponse.messages[0]?.message;
    const botFatherMessages = [
      "Alright, a new bot. How are we going to call it? Please choose a name for your bot.",
      "Good. Now let's choose a username for your bot. It must end in bot. Like this, for example: TetrisBot or tetris_bot.",
      "Choose a bot from the list below.",
    ];

    if (botFatherMessages.includes(botFatherMessage)) {
      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: botName,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (botFatherMessages.includes(botFatherMessage)) {
        await myThrottledInvoke("messages.SendMessage", {
          peer: botFather,
          message: `${botUsername}_${Date.now()}_bot`,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
          peer: botFather,
          limit: 1,
        });

        const botFatherMessageText = messagesResponse.messages[0]?.message;

        if (botFatherMessageText.includes("Sorry, this username is already taken.")) {
          return { success: false, message: "Username is already taken. Please try another." };
        } else {
          const tokenRegex = /Use this token to access the HTTP API:\s*(.*)\nKeep your token secure/;
          const tokenMatch = botFatherMessageText.match(tokenRegex);
          const token = tokenMatch?.[1]?.trim();

          const botLinkRegex = /You will find it at (.*)\./;
          const botLinkMatch = botFatherMessageText.match(botLinkRegex);
          const botLink = botLinkMatch?.[1]?.trim();

          return { success: true, message: "Bot created successfully", token, botLink };
        }
      }
    }
    return { success: false, message: "Unexpected response from BotFather" };
  } catch (error) {
    console.error("Error creating bot:", error);
    return { success: false, message: `Error: ${error}` };
  }
}

export async function updateBotName(
  username: string,
  name: string,
  client: TelegramClient
): Promise<{ success: boolean; message: string }> {
  try {
    if (!name) {
      return { success: false, message: "Name is required" };
    }

    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/setname",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessageText = messagesResponse.messages[0]?.message;
    console.log(botFatherMessageText, "botFatherMessageText");

    if (botFatherMessageText.includes("Choose a bot to change name")) {
      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: username,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: name,
      });

      return { success: true, message: `Bot name updated to "${name}"` };
    }

    return { success: false, message: "Unexpected response from BotFather" };
  } catch (error) {
    console.error(`Error updating bot name: ${error}`);
    return { success: false, message: `Error: ${error}` };
  }
}

export async function updateBotDescription(
  username: string,
  description: string,
  client: TelegramClient
): Promise<{ success: boolean; message: string }> {
  try {
    if (!description) {
      return { success: false, message: "Description is required" };
    }

    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/setdescription",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessageText = messagesResponse.messages[0]?.message;
    console.log(botFatherMessageText, "botFatherMessageText");

    if (botFatherMessageText.includes("Choose a bot to change description.")) {
      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: username,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: description,
      });

      return { success: true, message: `Bot description updated successfully` };
    }

    return { success: false, message: "Unexpected response from BotFather" };
  } catch (error) {
    console.error(`Error updating bot description: ${error}`);
    return { success: false, message: `Error: ${error}` };
  }
}
  
export async function updateBotAboutText(
  username: string,
  aboutText: string,
  client: TelegramClient
): Promise<{ success: boolean; message: string }> {
  try {
    if (!aboutText) {
      console.log("About text is required");
      return { success: false, message: "About text is required" };
    }

    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    // Send message to BotFather to update bot about text
    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/setabouttext",
    });

    // Wait for 2 seconds to allow BotFather to respond
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessage = messagesResponse.messages[0];
    const botFatherMessageText = botFatherMessage.message;
    console.log(botFatherMessageText, "botFatherMessageText");

    if (botFatherMessageText.includes("Choose a bot to change the about section.")) {
      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: username,
      });

      // Wait for 2 seconds to allow BotFather to respond
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await myThrottledInvoke("messages.SendMessage", {
        peer: botFather,
        message: aboutText,
      });

      return { success: true, message: `Successfully updated about text for ${username}` };
    } else {
      return { success: false, message: "Unexpected response from BotFather" };
    }
  } catch (error) {
    console.error(`Error updating bot about text: ${error}`);
    return { success: false, message: `Error: ${error}` };
  }
}

export async function deleteBot(username: string, client: TelegramClient) {
  try {
    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = 'BotFather';

    // Send message to BotFather to initiate bot deletion
    await myThrottledInvoke('messages.SendMessage', {
      peer: botFather,
      message: '/deletebot',
    });

    // Wait a moment to allow BotFather to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if BotFather is asking to choose a bot to delete
    const messagesResponse = await myThrottledInvoke('messages.GetHistory', {
      peer: botFather,
      limit: 2, // Increase the limit to capture a broader set of messages
    });

    const botFatherMessage = messagesResponse.messages[0].message;
    
    // Check if BotFather is asking to "Choose a bot to delete"
    if (botFatherMessage.includes('Choose a bot to delete.')) {
      // Send the bot's username to BotFather for deletion
      await myThrottledInvoke('messages.SendMessage', {
        peer: botFather,
        message: username,
      });

      // Wait again for BotFather's response
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get the response after trying to delete the bot
      const subsequentResponse = await myThrottledInvoke('messages.GetHistory', {
        peer: botFather,
        limit: 1,
      });

      const subsequentBotFatherMessage = subsequentResponse.messages[0].message;

      // Check if the bot was invalid or doesn't exist
      if (subsequentBotFatherMessage.includes('Invalid bot selected')) {
        console.log(`Bot with username ${username} does not exist.`);
        // Exit gracefully without further operations
        return { success: false, message: `Bot with username ${username} does not exist.` };
      }

      // Confirm deletion by sending 'Yes, I am totally sure.'
      await myThrottledInvoke('messages.SendMessage', {
        peer: botFather,
        message: 'Yes, I am totally sure.',
      });

      console.log(`Bot ${username} deleted successfully.`);
      return { success: true, message: `Bot ${username} deleted successfully.` };
    } else {
      console.log(`BotFather did not prompt to choose a bot. Response: ${botFatherMessage}`);
      return { success: false, message: `Unexpected BotFather response: ${botFatherMessage}` };
    }
  } catch (error) {
    console.error(`Error deleting bot: ${error}`);
    return { success: false, message: `Error deleting bot: ${error}` };
  }
}
export async function revokeAndGenerateNewToken(
  botUsername: string,
  client: TelegramClient
): Promise<{ success: boolean; message: string; newToken?: string }> {
  try {
    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    // Step 1: Send /revoke command to BotFather
    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/revoke",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Get BotFather's response
    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessage = messagesResponse.messages[0]?.message;

    if (!botFatherMessage.includes("Choose a bot to generate a new token")) {
      return { success: false, message: "Unexpected response from BotFather." };
    }

    // Step 3: Send bot username to BotFather
    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: `@${botUsername}`,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Get BotFather's response with the new token
    const newMessagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const newBotFatherMessage = newMessagesResponse.messages[0]?.message;

    // Step 5: Extract new token
    const tokenRegex = /You can use this token to access HTTP API:\s*(.*)/;
    const tokenMatch = newBotFatherMessage.match(tokenRegex);
    const newToken = tokenMatch?.[1]?.trim();

    if (!newToken) {
      return { success: false, message: "Failed to retrieve new token." };
    }

    return { success: true, message: "Token revoked and replaced successfully.", newToken };
  } catch (error) {
    console.error("Error revoking token:", error);
    return { success: false, message: `Error: ${error}` };
  }
}
export async function getBotToken(
  botUsername: string,
  client: TelegramClient
): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const myThrottledInvoke = throttledInvoke(client, limiter);
    const botFather = "BotFather";

    // Step 1: Send /token command to BotFather
    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: "/token",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Get BotFather's response
    const messagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const botFatherMessage = messagesResponse.messages[0]?.message;

    if (!botFatherMessage.includes("Choose a bot to generate a new token")) {
      return { success: false, message: "Unexpected response from BotFather." };
    }

    // Step 3: Send bot username to BotFather
    await myThrottledInvoke("messages.SendMessage", {
      peer: botFather,
      message: `@${botUsername}`,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Get BotFather's response with the token
    const newMessagesResponse = await myThrottledInvoke("messages.GetHistory", {
      peer: botFather,
      limit: 1,
    });

    const newBotFatherMessage = newMessagesResponse.messages[0]?.message;

    // Step 5: Extract bot token
    const tokenRegex = /You can use this token to access HTTP API:\s*(.*)/;
    const tokenMatch = newBotFatherMessage.match(tokenRegex);
    const botToken = tokenMatch?.[1]?.trim();

    if (!botToken) {
      return { success: false, message: "Failed to retrieve bot token." };
    }

    return { success: true, message: "Bot token retrieved successfully.", token: botToken };
  } catch (error) {
    console.error("Error retrieving bot token:", error);
    return { success: false, message: `Error: ${error}` };
  }
}

