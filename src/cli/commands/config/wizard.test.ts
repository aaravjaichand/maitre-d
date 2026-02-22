import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigManager } from '../../../config/index.js';
import { CredentialStore } from '../../../storage/credential-store.js';

// Track calls to mock prompt functions
let promptCallIndex = 0;
let promptResponses: unknown[] = [];

vi.mock('@clack/prompts', () => ({
  text: vi.fn(async () => promptResponses[promptCallIndex++] ?? ''),
  password: vi.fn(async () => promptResponses[promptCallIndex++] ?? ''),
  select: vi.fn(async () => promptResponses[promptCallIndex++] ?? 'skip'),
  multiselect: vi.fn(async () => promptResponses[promptCallIndex++] ?? []),
  confirm: vi.fn(async () => promptResponses[promptCallIndex++] ?? true),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  log: { step: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), message: vi.fn() },
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));

describe('runWizard', () => {
  let tempDir: string;
  let configManager: ConfigManager;
  let credentialStore: CredentialStore;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-wizard-test-'));
    configManager = new ConfigManager({ cwd: tempDir });
    credentialStore = new CredentialStore(join(tempDir, 'credentials.json'));
    promptCallIndex = 0;
    promptResponses = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should complete a full wizard run with all skips', async () => {
    // Set MAITRED_PASSPHRASE to skip passphrase prompts
    const origPassphrase = process.env['MAITRED_PASSPHRASE'];
    process.env['MAITRED_PASSPHRASE'] = 'test-passphrase';

    try {
      promptResponses = [
        [],         // platforms: skip all
        'skip',     // calendar: skip
        'skip',     // ai: skip
        [],         // notifications: skip all
        '',         // preferences: skip
      ];

      const { runWizard } = await import('./wizard.js');
      await runWizard(configManager, credentialStore);

      const config = configManager.getAll();
      expect(config._initialized).toBe(true);
    } finally {
      if (origPassphrase === undefined) {
        delete process.env['MAITRED_PASSPHRASE'];
      } else {
        process.env['MAITRED_PASSPHRASE'] = origPassphrase;
      }
    }
  });

  it('should complete wizard with selections', async () => {
    const origPassphrase = process.env['MAITRED_PASSPHRASE'];
    process.env['MAITRED_PASSPHRASE'] = 'test-passphrase';

    try {
      promptResponses = [
        ['resy'],         // platforms: select resy
        'user@test.com',  // resy email
        'pass123',        // resy password
        'google',         // calendar: google
        'openai',         // ai: openai
        'sk-test-key',    // openai api key
        'gpt-4o',         // model
        [],               // notifications: skip
        'I love sushi',   // preferences
      ];

      const { runWizard } = await import('./wizard.js');
      await runWizard(configManager, credentialStore);

      const config = configManager.getAll();
      expect(config._initialized).toBe(true);
      expect(config.platforms.resy?.enabled).toBe(true);
      expect(config.calendar.provider).toBe('google');
      expect(config.ai.provider).toBe('openai');
      expect(config.ai.enabled).toBe(true);
      expect(config.userPreferences.description).toBe('I love sushi');
    } finally {
      if (origPassphrase === undefined) {
        delete process.env['MAITRED_PASSPHRASE'];
      } else {
        process.env['MAITRED_PASSPHRASE'] = origPassphrase;
      }
    }
  });

  it('should handle cancellation gracefully', async () => {
    const origPassphrase = process.env['MAITRED_PASSPHRASE'];
    process.env['MAITRED_PASSPHRASE'] = 'test-passphrase';

    try {
      const clack = await import('@clack/prompts');

      // Make multiselect return cancel symbol on the first call (platforms)
      const cancelSym = Symbol('cancel');
      promptResponses = [cancelSym];
      vi.mocked(clack.isCancel).mockImplementation((value) => value === cancelSym);

      const { runWizard } = await import('./wizard.js');
      await runWizard(configManager, credentialStore);

      // Config should NOT be initialized since we cancelled
      const config = configManager.getAll();
      expect(config._initialized).toBe(false);
    } finally {
      vi.mocked((await import('@clack/prompts')).isCancel).mockImplementation(() => false);
      if (origPassphrase === undefined) {
        delete process.env['MAITRED_PASSPHRASE'];
      } else {
        process.env['MAITRED_PASSPHRASE'] = origPassphrase;
      }
    }
  });
});
