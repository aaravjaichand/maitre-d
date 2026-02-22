import type { MaitredConfig } from '../types/index.js';

export const DEFAULT_CONFIG: MaitredConfig = {
  _initialized: false,
  platforms: {},
  ai: {
    temperature: 0.3,
    enabled: false,
  },
  calendar: {
    calendarId: 'primary',
    checkConflicts: true,
    createEvents: true,
  },
  notifications: {
    terminal: true,
    email: {
      enabled: false,
      smtpPort: 587,
    },
    webhook: {
      enabled: false,
      headers: {},
    },
  },
  monitoring: {
    defaultPollIntervalMs: 30000,
    maxConcurrentWatches: 20,
    adaptivePolling: true,
  },
  booking: {
    defaultPartySize: 2,
    defaultMode: 'auto_book',
    retryAttempts: 3,
  },
  logging: {
    level: 'info',
  },
  userPreferences: {},
};
