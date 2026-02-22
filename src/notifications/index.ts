import type { NotificationChannel } from '../types/index.js';

/**
 * Registry for notification channels (Terminal, Email, Webhook).
 * Supports filtering to only enabled channels.
 */
export class NotificationRegistry {
  private channels = new Map<string, NotificationChannel>();

  /** Register a notification channel. */
  register(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel);
  }

  /** Get a notification channel by ID. Throws if not found. */
  get(channelId: string): NotificationChannel {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Unknown notification channel: ${channelId}`);
    }
    return channel;
  }

  /** Get all registered notification channels. */
  getAll(): NotificationChannel[] {
    return Array.from(this.channels.values());
  }

  /** Check if a notification channel is registered. */
  has(channelId: string): boolean {
    return this.channels.has(channelId);
  }

  /** Get only the currently enabled notification channels. */
  getEnabled(): NotificationChannel[] {
    return Array.from(this.channels.values()).filter((ch) => ch.isEnabled());
  }
}
