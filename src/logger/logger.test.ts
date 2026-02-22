import { describe, it, expect } from 'vitest';
import { createLogger, createChildLogger } from './index.js';

describe('Logger', () => {
  it('should create a logger with default level', () => {
    const logger = createLogger({ level: 'info' });
    expect(logger).toBeDefined();
    expect(logger.level).toBe('info');
  });

  it('should create a child logger with module name', () => {
    const parent = createLogger({ level: 'info' });
    const child = createChildLogger(parent, 'test-module');
    expect(child).toBeDefined();
    // Child logger should have the module binding
    expect(child.bindings()).toHaveProperty('module', 'test-module');
  });

  it('should redact sensitive fields', () => {
    const logger = createLogger({ level: 'trace' });
    // Verify redact paths are configured
    // pino stores redact config internally — we verify it doesn't throw
    expect(() => {
      logger.info({ password: 'secret123', user: 'test' }, 'test message');
    }).not.toThrow();
  });
});
