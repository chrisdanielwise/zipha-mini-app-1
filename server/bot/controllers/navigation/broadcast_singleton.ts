// Optionally, define a more specific type for the message if available.
interface TelegramMessage {
  // Define known properties or use a more precise type if available.
  message_id?: number;
  text?: string;
  // Add more properties as needed.
}

export interface BroadcastInstance {
  active: boolean;
  message: TelegramMessage | null; // More specific type if possible
  userId: Record<string, any>; // Replace with a more specific interface if possible
  messageId: number | null;
  // Optional channelId if needed:
  channelId?: number;
}

let instance: BroadcastInstance | null = null;

export function Broadcast(): BroadcastInstance {
  return instance || (instance = {
    active: false,
    message: null,
    userId: {},
    messageId: null,
  });
} 