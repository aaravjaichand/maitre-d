import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigManager } from '../../config/index.js';
import { withConfigCheck } from './config-check.js';

vi.mock('@clack/prompts', () => ({
  text: vi.fn(),
  password: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  confirm: vi.fn(),
  isCancel: vi.fn(() => false),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  log: { step: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), message: vi.fn() },
}));

describe('withConfigCheck', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-middleware-test-'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should block action when config is not initialized', async () => {
    const action = vi.fn();
    vi.spyOn(ConfigManager.prototype, 'getAll').mockReturnValue({
      _initialized: false,
      platforms: {},
      ai: { temperature: 0.3, enabled: false },
      calendar: { calendarId: 'primary', checkConflicts: true, createEvents: true },
      notifications: { terminal: true, email: { enabled: false, smtpPort: 587 }, webhook: { enabled: false, headers: {} } },
      monitoring: { defaultPollIntervalMs: 30000, maxConcurrentWatches: 20, adaptivePolling: true },
      booking: { defaultPartySize: 2, defaultMode: 'auto_book', retryAttempts: 3 },
      logging: { level: 'info' },
      userPreferences: {},
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const wrapped = withConfigCheck(action);
    await wrapped();

    expect(action).not.toHaveBeenCalled();
    const output = consoleSpy.mock.calls.flat().join('\n');
    expect(output).toContain('maitre-d config');
    consoleSpy.mockRestore();
  });

  it('should pass through when config is initialized', async () => {
    const action = vi.fn();
    vi.spyOn(ConfigManager.prototype, 'getAll').mockReturnValue({
      _initialized: true,
      platforms: {},
      ai: { temperature: 0.3, enabled: false },
      calendar: { calendarId: 'primary', checkConflicts: true, createEvents: true },
      notifications: { terminal: true, email: { enabled: false, smtpPort: 587 }, webhook: { enabled: false, headers: {} } },
      monitoring: { defaultPollIntervalMs: 30000, maxConcurrentWatches: 20, adaptivePolling: true },
      booking: { defaultPartySize: 2, defaultMode: 'auto_book', retryAttempts: 3 },
      logging: { level: 'info' },
      userPreferences: {},
    });

    const wrapped = withConfigCheck(action);
    await wrapped();

    expect(action).toHaveBeenCalled();
  });
});
