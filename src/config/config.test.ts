import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigManager } from './index.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('ConfigManager', () => {
  let tempDir: string;
  let config: ConfigManager;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-config-test-'));
    config = new ConfigManager({ cwd: tempDir });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should load default config values', () => {
    const all = config.getAll();
    expect(all.logging.level).toBe('info');
    expect(all.booking.defaultPartySize).toBe(2);
    expect(all.monitoring.adaptivePolling).toBe(true);
    expect(all.notifications.terminal).toBe(true);
  });

  it('should get a specific config section', () => {
    const booking = config.get('booking');
    expect(booking.defaultPartySize).toBe(2);
    expect(booking.defaultMode).toBe('auto_book');
    expect(booking.retryAttempts).toBe(3);
  });

  it('should set and persist a config value', () => {
    config.set('booking', {
      defaultPartySize: 4,
      defaultMode: 'notify',
      retryAttempts: 5,
    });

    const booking = config.get('booking');
    expect(booking.defaultPartySize).toBe(4);
    expect(booking.defaultMode).toBe('notify');

    // Reload from disk to verify persistence
    const config2 = new ConfigManager({ cwd: tempDir });
    expect(config2.get('booking').defaultPartySize).toBe(4);
  });

  it('should apply env var overrides', () => {
    const originalEnv = process.env.MAITRED_LOG_LEVEL;
    try {
      process.env.MAITRED_LOG_LEVEL = 'debug';
      const envConfig = new ConfigManager({ cwd: tempDir, configName: 'env-test' });
      expect(envConfig.get('logging').level).toBe('debug');
    } finally {
      if (originalEnv === undefined) {
        delete process.env.MAITRED_LOG_LEVEL;
      } else {
        process.env.MAITRED_LOG_LEVEL = originalEnv;
      }
    }
  });

  it('should expose the config file path', () => {
    expect(config.path).toContain(tempDir);
  });
});
