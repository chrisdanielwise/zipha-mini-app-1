import childProcess from "child_process";
import os from "os";
import process from "process";
import dotenv from "dotenv";
import { GreyBotHandler } from "./greybotHandler";
import { connectDB } from "./connection";
import { getGreybot, setWebhook } from "./setWebhook";
import CatchMechanismClass from "../models/catchMechanismClass";
import mongoose from "mongoose";
import { settingsClass } from "../controllers/callback_handlers/settings/settingsClass";
// Explicitly specify the .env.local file
dotenv.config({ path: ".env.local" });

export interface SessionData {
  step: string;
}
const nodeEnv: string = process.env.NODE_ENV || "development";
const ADMIN_ID: string = process.env.ADMIN_ID as string;
const USER_NAME: string = process.env.USER_NAME as string;

/**
 * Initializes Greybot, sets the webhook, and starts bot handlers.
 */
async function initializeGreybot(): Promise<void> {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB successfully!");

    await getGreybot().init();
    console.log("✅ Greybot initialized successfully!");

    // Set webhook if needed
    await setWebhook();

    // Initialize handlers and load settings
    await GreyBotHandler();
    const settings = settingsClass();
    // console.log(await settings.getSettings(),"settings ")
    await settings.getSettings();
    const catchMechanismInstance = CatchMechanismClass.getInstance(mongoose.connection);
    await catchMechanismInstance.initialize();
  } catch (err: any) {
    console.error("Error initializing Greybot:", err);
    await sendSystemInfoToAdmin(err);
    await restartBotWithPM2();
  }
}

// Function to send system information to admin
async function sendSystemInfoToAdmin(err: any): Promise<void> {
  const adminId: string = ADMIN_ID;

  const cpuInfo: string = `${os.cpus().map((cpu) => cpu.model).join(`\n  \t`)} (${os.cpus().length} cores)`;
  const ramInfo: string = `${Math.round(os.totalmem() / 1024 / 1024)} GB (${Math.round(os.totalmem() / 1024 / 1024)} MB) of RAM, with all of it being used.`;
  const heapInfo: string = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB out of a total of ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB.`;
  const rssInfo: string = `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB.`;
  const uptimeSeconds: number = os.uptime();
  const days: number = Math.floor(uptimeSeconds / 86400);
  const hours: number = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes: number = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds: number = uptimeSeconds % 60;
  const uptimeInfo: string = `The system has been running for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds without a restart.`;
  const platformInfo: string = `The system is running on ${os.platform()} (${os.platform() === 'darwin' ? 'macOS' : os.platform()}) platform.`;
  const architectureInfo: string = `The architecture is ${os.arch()}, indicating a ${os.arch() === 'x64' ? '64-bit' : '32-bit'} system.`;
  const nodeVersionInfo: string = `The system is running Node.js version ${process.version}.`;
  const errorMessage: string = `There is an error message indicating ${err.name}: An error occurred: ${err.message}. Please check the code for any programming errors.`;

  const systemInfo: string = `
<pre>
<blockquote>
<code>
  <b style="color: #FF0000">System Information for ${USER_NAME}</b>

  <b style="color: #FFFF00">CPU Usage</b>
  <code><i class="fa fa-microchip"></i> ${cpuInfo}</code>

  <b style="color: #008000">RAM Usage</b>
  <code><i class="fa fa-memory"></i> ${ramInfo}</code>

  <b style="color: #0000FF">Heap Memory</b>
  <code><i class="fa fa-database"></i> ${heapInfo}</code>

  <b style="color: #FFA500">RSS Memory</b>
  <code><i class="fa fa-server"></i> ${rssInfo}</code>

  <b style="color: #008080">Uptime</b>
  <code><i class="fa fa-clock"></i> ${uptimeInfo}</code>

  <b style="color: #800080">Platform and Architecture</b>
  <code><i class="fa fa-laptop"></i> ${platformInfo} ${architectureInfo}</code>

  <b style="color: #00FF00">Node Version</b>
  <code><i class="fa fa-tag"></i> ${nodeVersionInfo}</code>

  <b style="color: #FF0000">Error Message</b>
  <code><i class="fa fa-exclamation-triangle"></i> ${errorMessage}</code>
</code>
</blockquote>
</pre>
<blockquote>
<strong>Explanations:</strong>
<strong style="color: #FF0000">CPU Usage:</strong> This shows the current CPU usage and the number of CPU cores available. A high CPU usage may indicate performance issues.

<strong style="color: #008000">RAM Usage:</strong> This shows the current RAM usage and the total amount of RAM available. Low RAM may cause performance issues or crashes.

<strong style="color: #0000FF">Heap Memory:</strong> This shows the current heap memory usage and the total heap memory available. Heap memory is used by the Node.js process to store data. High heap usage may indicate memory leaks.

<strong style="color: #FFA500">RSS Memory:</strong> This shows the current RSS (Resident Set Size) memory usage, which is the amount of memory used by the process. High RSS usage may indicate performance issues.

<strong style="color: #008080">Uptime:</strong> This shows the amount of time the process has been running. A long uptime may indicate stability issues.

<strong style="color: #800080">Platform:</strong> This shows the operating system platform (e.g. Windows, Linux, macOS). Different platforms may have different performance characteristics.

<strong style="color: #008000">Architecture:</strong> This shows the processor architecture (e.g. x86, arm). Different architectures may have different performance characteristics.

<strong style="color: #00FF00">Node Version:</strong> This shows the version of Node.js being used. Different versions may have different performance characteristics or bug fixes.

<strong style="color: #FF0000">Error Message:</strong> This shows the error message that occurred. This can help identify the cause of issues.
</blockquote>
`;

  console.log("Sending error message to admin...");
  try {
    await getGreybot().api.sendMessage(adminId, systemInfo, {
      parse_mode: "HTML",
      // disable_web_page_preview: true,
    });
  } catch (error) {
    console.error("Error sending message to admin:", error);
  }
}

async function restartBotWithPM2(): Promise<void> {
  console.log("Restarting the bot with PM2...");
  if (nodeEnv === "development") {
    childProcess.exec("npx pm2 restart greysuit_zipha_bot --watch");
  } else if (nodeEnv === "production") {
    childProcess.exec("npx pm2 restart ecosystem.config.js --no-daemon");
  }
}

export { 
  getGreybot,
  initializeGreybot,
  sendSystemInfoToAdmin,
  restartBotWithPM2,
};