/** Types of notifications the system can emit */
export type NotificationType =
  | 'booking_confirmed'
  | 'slot_found'
  | 'snipe_fired'
  | 'snipe_failed'
  | 'watch_started'
  | 'watch_error'
  | 'calendar_conflict';

/** A notification message to be sent through one or more channels */
export interface NotificationMessage {
  /** Notification title / headline */
  title: string;
  /** Full notification body with details */
  body: string;
  /** Short summary for compact notification formats */
  summary: string;
  /** URL to open (for platforms that support links) */
  url?: string;
  /** Urgency level affects delivery priority */
  urgency: 'low' | 'normal' | 'high';
}

/** Result of attempting to send a notification */
export interface NotificationResult {
  /** Whether the notification was sent successfully */
  success: boolean;
  /** Error message if the send failed */
  error?: string;
}

/** Common interface for all notification channel adapters */
export interface NotificationChannel {
  /** Unique channel identifier (e.g., 'terminal', 'email', 'webhook') */
  readonly id: string;
  /** Human-readable channel name */
  readonly name: string;

  /** Check if this notification channel is enabled */
  isEnabled(): boolean;
  /** Send a notification message through this channel */
  send(message: NotificationMessage): Promise<NotificationResult>;
}
