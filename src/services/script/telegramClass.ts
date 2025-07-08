import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as readline from "readline";
import Bottleneck from "bottleneck";

/**
 * Manages a single Telegram client instance.
 */
export default class TelegramService {
  private static client: TelegramClient | null = null;
  private static sessionString: string = process.env.TELEGRAM_SESSION || "";
  private static readonly apiId: number = parseInt(process.env.TELEGRAM_API_ID!, 10);
  private static readonly apiHash: string = process.env.TELEGRAM_API_HASH!;

  /**
   * Readline interface for user input.
   */
  private static rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  /**
   * Prompts the user for input via the terminal.
   */
  private static async getInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => resolve(answer.trim()));
    });
  }

  /**
   * Logs into Telegram and returns a session string.
   */
  private static async login(): Promise<string> {
    console.log("No session found. Logging in...");

    const tempClient = new TelegramClient(new StringSession(""), this.apiId, this.apiHash, {
      connectionRetries: 5, // Increase retries
      requestRetries: 10, // Increase API call retries
      timeout: 60000, // Increase timeout (60s)
    });

    await tempClient.start({
      phoneNumber: async () => await this.getInput("Enter your phone number: "),
      phoneCode: async () => await this.getInput("Enter the login code you received: "),
      password: async () => await this.getInput("Enter your 2FA password (if set): "),
      onError: (err) => {
        console.error("Telegram login error:", err);
        process.exit(1);
      },
    });

    this.sessionString = tempClient.session.save()!;
    console.log("Session saved:", this.sessionString);

    await tempClient.disconnect();
    return this.sessionString;
  }

  /**
   * Initializes and returns a singleton Telegram client.
   */
  public static async getClient(): Promise<TelegramClient> {
    if (this.client) {
      console.log("Reusing existing Telegram client...");
      return this.client;
    }

    console.log("Initializing Telegram client...");

    if (!this.sessionString) {
      this.sessionString = await this.login();
    }

    const stringSession = new StringSession(this.sessionString);
    this.client = new TelegramClient(stringSession, this.apiId, this.apiHash, {
      connectionRetries: 5, // Increase retries
      requestRetries: 10, // Increase API call retries
      timeout: 60000, // Increase timeout (60s)
    });

    try {
      await this.client.connect();
      console.log("Telegram client connected successfully!");
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
      throw new Error("Failed to connect to Telegram client.");
    }

    return this.client;
  }

  /**
   * Disconnects the Telegram client.
   */
  public static async disconnect(): Promise<void> {
    if (this.client) {
      console.log("Disconnecting from Telegram...");
      await this.client.disconnect();
      console.log("Successfully disconnected.");
      this.client = null;
    }
    this.rl.close(); // Close input stream
  }
}

  // Wrap client.invoke with the rate limiter
export const throttledInvoke = (client: TelegramClient, limiter: Bottleneck): ((method: string, params: any) => Promise<any>) =>
  limiter.wrap(async (method: string, params: any): Promise<any> => { 
    console.log("throttledInvoke called for:", method, params, client.connected);

    if (!client.connected) {
      console.warn("Client is disconnected! Attempting to reconnect...");
      await client.connect();
    }

    try {
      const [module, apiMethodName] = method.split(".");
      const apiMethod = (Api as any)[module][apiMethodName];

      return await client.invoke(new apiMethod(params)); 
    } catch (error: any) {
      if (error.message.includes("FLOOD_WAIT")) {
        const waitTime = parseInt(error.message.match(/\d+/)?.[0] ?? "30", 10);
        console.warn(`Hit FLOOD_WAIT. Waiting ${waitTime} seconds before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        
        return throttledInvoke(client, limiter)(method, params); // ✅ Correct recursion
      }

      console.error("Telegram API Error:", error);
      throw error;
    }
  });