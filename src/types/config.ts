/** SMTP email notification configuration */
export interface EmailConfig {
  /** Whether email notifications are enabled */
  enabled: boolean;
  /** SMTP server hostname */
  smtpHost?: string;
  /** SMTP server port */
  smtpPort: number;
  /** SMTP authentication username */
  smtpUser?: string;
  /** SMTP authentication password (stored in keychain, referenced here) */
  smtpPassword?: string;
  /** Email address to send from */
  fromAddress?: string;
  /** Email address to send to */
  toAddress?: string;
}

/** Webhook notification configuration */
export interface WebhookConfig {
  /** Whether webhook notifications are enabled */
  enabled: boolean;
  /** Webhook endpoint URL */
  url?: string;
  /** Custom HTTP headers to include with the webhook request */
  headers: Record<string, string>;
}

/** Top-level maitre-d configuration */
export interface MaitredConfig {
  /** Whether the user has completed initial setup */
  _initialized: boolean;
  /** Platform-specific settings keyed by platform ID */
  platforms: Record<string, { /** Whether this platform is enabled */ enabled: boolean }>;
  /** AI/LLM provider settings */
  ai: {
    /** LLM provider identifier (e.g., 'openai', 'anthropic', 'google', 'ollama') */
    provider?: string;
    /** Model name for the chosen provider */
    model?: string;
    /** Base URL override for OpenAI-compatible providers */
    baseUrl?: string;
    /** Sampling temperature for LLM completions */
    temperature: number;
    /** Whether AI features are enabled */
    enabled: boolean;
  };
  /** Calendar integration settings */
  calendar: {
    /** Calendar provider identifier (e.g., 'google', 'apple', 'outlook', 'caldav') */
    provider?: string;
    /** Which calendar to use on the provider */
    calendarId: string;
    /** Whether to check calendar for conflicts before booking */
    checkConflicts: boolean;
    /** Whether to auto-create calendar events for bookings */
    createEvents: boolean;
  };
  /** Notification channel settings */
  notifications: {
    /** Whether terminal notifications are enabled (always-on baseline) */
    terminal: boolean;
    /** Email notification settings */
    email: EmailConfig;
    /** Webhook notification settings */
    webhook: WebhookConfig;
  };
  /** Monitoring behavior settings */
  monitoring: {
    /** Default polling interval for watches in milliseconds */
    defaultPollIntervalMs: number;
    /** Maximum number of concurrent watch tasks */
    maxConcurrentWatches: number;
    /** Whether to use adaptive polling intervals */
    adaptivePolling: boolean;
  };
  /** Booking behavior settings */
  booking: {
    /** Default party size for reservations */
    defaultPartySize: number;
    /** Default watch mode: auto-book or notify only */
    defaultMode: 'auto_book' | 'notify';
    /** Number of retry attempts for failed bookings */
    retryAttempts: number;
  };
  /** Logging settings */
  logging: {
    /** Log level */
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    /** Optional log file path */
    file?: string;
  };
  /** Free-text user dining preferences for AI context */
  userPreferences: {
    /** Natural language description of dining preferences */
    description?: string;
  };
}
