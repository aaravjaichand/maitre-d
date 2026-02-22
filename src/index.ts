/**
 * maitre-d — The open-source, AI-powered restaurant reservation agent.
 *
 * Public API exports for all modules.
 */

// Types
export * from './types/index.js';

// Infrastructure
export { createLogger, createChildLogger } from './logger/index.js';
export type { LoggerOptions } from './logger/index.js';
export { Container, TOKENS } from './container/index.js';

// Config
export { ConfigManager } from './config/index.js';
export { MaitredConfigSchema } from './config/schema.js';
export type { ValidatedConfig } from './config/schema.js';

// Storage
export { CredentialStore } from './storage/credential-store.js';
export { DataStore } from './storage/data-store.js';

// Registries
export { PlatformRegistry } from './platforms/index.js';
export { CalendarRegistry } from './calendar/index.js';
export { LLMRegistry } from './ai/index.js';
export { NotificationRegistry } from './notifications/index.js';
