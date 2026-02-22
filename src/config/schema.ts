import { z } from 'zod';

const PlatformConfigSchema = z.object({
  enabled: z.boolean().default(false),
});

const AIConfigSchema = z.object({
  provider: z.string().optional(),
  model: z.string().optional(),
  baseUrl: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.3),
  enabled: z.boolean().default(false),
});

const EmailConfigSchema = z.object({
  enabled: z.boolean().default(false),
  smtpHost: z.string().optional(),
  smtpPort: z.number().default(587),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
});

const WebhookConfigSchema = z.object({
  enabled: z.boolean().default(false),
  url: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

const NotificationsConfigSchema = z.object({
  terminal: z.boolean().default(true),
  email: EmailConfigSchema.default(() => ({ enabled: false, smtpPort: 587 })),
  webhook: WebhookConfigSchema.default(() => ({ enabled: false })),
});

const CalendarConfigSchema = z.object({
  provider: z.string().optional(),
  calendarId: z.string().default('primary'),
  checkConflicts: z.boolean().default(true),
  createEvents: z.boolean().default(true),
});

const MonitoringConfigSchema = z.object({
  defaultPollIntervalMs: z.number().min(5000).default(30000),
  maxConcurrentWatches: z.number().min(1).max(50).default(20),
  adaptivePolling: z.boolean().default(true),
});

const BookingConfigSchema = z.object({
  defaultPartySize: z.number().min(1).max(20).default(2),
  defaultMode: z.enum(['auto_book', 'notify']).default('auto_book'),
  retryAttempts: z.number().min(0).max(10).default(3),
});

const LoggingConfigSchema = z.object({
  level: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  file: z.string().optional(),
});

const UserPreferencesSchema = z.object({
  description: z.string().optional(),
});

export const MaitredConfigSchema = z.object({
  _initialized: z.boolean().default(false),
  platforms: z.record(z.string(), PlatformConfigSchema).default(() => ({})),
  ai: AIConfigSchema.default(() => ({ temperature: 0.3, enabled: false })),
  calendar: CalendarConfigSchema.default(() => ({
    calendarId: 'primary',
    checkConflicts: true,
    createEvents: true,
  })),
  notifications: NotificationsConfigSchema.default(() => ({
    terminal: true,
    email: { enabled: false, smtpPort: 587 },
    webhook: { enabled: false },
  })),
  monitoring: MonitoringConfigSchema.default(() => ({
    defaultPollIntervalMs: 30000,
    maxConcurrentWatches: 20,
    adaptivePolling: true,
  })),
  booking: BookingConfigSchema.default(() => ({
    defaultPartySize: 2,
    defaultMode: 'auto_book' as const,
    retryAttempts: 3,
  })),
  logging: LoggingConfigSchema.default(() => ({ level: 'info' as const })),
  userPreferences: UserPreferencesSchema.default(() => ({})),
});

export type ValidatedConfig = z.infer<typeof MaitredConfigSchema>;
