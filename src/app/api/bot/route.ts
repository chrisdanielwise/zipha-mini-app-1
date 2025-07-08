import { NextResponse as res } from 'next/server';
import { createBotInstance, deleteBot, getBotToken, revokeAndGenerateNewToken, updateBotAboutText, updateBotDescription, updateBotName } from 'src/services/script/bot';
import { TelegramClient } from 'telegram';
import TelegramService from 'src/services/script/telegramClass';
import { createNewBranch, deleteBranch, handleWebhook, updateAllBranches } from 'src/services/script/githubScript';


export async function POST(req: Request) {
  const body = await req.json();

  // Get a singleton Telegram client with parameters
  let client: TelegramClient | null = null; // ✅ Declare before use
  if (!client) throw new Error("Client not initialized");
  // Log the incoming request and response objects to check for any anomalies
  // console.log("Received request:", body);

  if (!body) {
    return res.json({ error: "Request body is missing" }, { status: 400 });
  }

  const { endpoint, botUsername, botName, description, aboutText, owner, repo, existingBranchName, newBranchName, branchName, payload } = body;

  // Check if endpoint exists before destructuring
  if (!endpoint) {
    return res.json({ error: "Endpoint is missing in the request body" }, { status: 400 });
  }

  const telegramEndpoints = ["create-bot", "get-token", "revoke-token", "delete-bot", "update-bot"];

  if (telegramEndpoints.includes(endpoint)) {
    client = await TelegramService.getClient();
  }

  switch (endpoint) {
    case "create-bot":
      try {
        if (client) {
          const info = await createBotInstance(botName, botUsername, client);
          return res.json(info);
        }


      } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to create bot" }, { status: 500 });
      }
    case "get-token":
      try {
        const result = await getBotToken(botUsername, client);
        return res.json(result);
      } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to get bot token" }, { status: 500 });
      }
    case "revoke-token":
      try {
        const result = await revokeAndGenerateNewToken(botUsername, client);
        return res.json(result);
      } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to revoke and generate new token" }, { status: 500 });
      }
    case "delete-bot":
      try {
        if (!botUsername) {
          return res.json({ error: "botUsername is required" }, { status: 400 });
        }

        const deleteObj = await deleteBot(botUsername, client);

        if (deleteObj.success) {
          return res.json(deleteObj);
        } else {
          return res.json(deleteObj, { status: 500 });
        }
      } catch (error) {
        console.error(`Error deleting bot: ${error}`);
        return res.json({ error: "Failed to delete bot" }, { status: 500 });
      }
    case "update-bot":
      try {
        if (!botUsername) {
          return res.json({ error: "botUsername is required" }, { status: 400 });
        }

        if (botName) {
          await updateBotName(botUsername, botName, client);
        }

        if (description) {
          await updateBotDescription(botUsername, description, client);
        }

        if (aboutText) {
          await updateBotAboutText(botUsername, aboutText, client);
        }

        if (!botName && !description && !aboutText) {
          return res.json({ error: "Name, description, or about text is required" }, { status: 400 });
        }

        return res.json({
          message: `Updated bot ${botUsername} successfully!`,
        });
      } catch (error) {
        console.error(`Error updating bot: ${error}`);
        return res.json({ error: "Failed to update bot" }, { status: 500 });
      }
    case "webhook":
      try {
        await handleWebhook(payload);
        return res.json({ message: "Webhook handled successfully!" });
      } catch (error) {
        console.error(error);
        return res.json({ error: "Failed to handle webhook" }, { status: 500 });
      }
    case "create-branch":
      try {
        const result = await createNewBranch(owner, repo, existingBranchName, newBranchName!);
        console.log(result, "result");

        if (result.success) {
          return res.json(result, { status: 200 });
        } else {
          return res.json(result, { status: 400 });
        }
      } catch (error: any) {
        console.error(error);
        return res.json({ error: error.message || "Failed to create branch" }, { status: 500 });
      }
    case "update-all-branches":
      try {
        const result = await updateAllBranches(owner, repo, undefined);
        console.log(result, "result");

        if (result.success) {
          return res.json(result, { status: 200 });
        } else {
          return res.json(result, { status: 400 });
        }
      } catch (error: any) {
        console.error(error);
        return res.json({ error: error.message || "Failed to update branches" }, { status: 500 });
      }
    case "delete-branch":
      try {
        const result = await deleteBranch(owner, repo, branchName);

        if (result.success) {
          return res.json(result, { status: 200 });
        } else {
          return res.json(result, { status: 400 });
        }
      } catch (error: any) {
        console.error(error);
        return res.json({ error: error.message || "Failed to delete branch" }, { status: 500 });
      }

    default:
      return res.json({ error: "Not found" }, { status: 404 });
  }
}