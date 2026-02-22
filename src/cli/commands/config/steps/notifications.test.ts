import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CredentialStore } from '../../../../storage/credential-store.js';

let promptCallIndex = 0;
let promptResponses: unknown[] = [];

vi.mock('@clack/prompts', () => ({
  text: vi.fn(async () => promptResponses[promptCallIndex++] ?? ''),
  password: vi.fn(async () => promptResponses[promptCallIndex++] ?? ''),
  select: vi.fn(async () => promptResponses[promptCallIndex++] ?? 'skip'),
  multiselect: vi.fn(async () => promptResponses[promptCallIndex++] ?? []),
  confirm: vi.fn(async () => promptResponses[promptCallIndex++] ?? true),
  isCancel: vi.fn(() => false),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  log: { step: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), message: vi.fn() },
}));

describe('runNotificationsStep', () => {
  let tempDir: string;
  let credentialStore: CredentialStore;
  const passphrase = 'test-pass';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-notif-test-'));
    credentialStore = new CredentialStore(join(tempDir, 'credentials.json'));
    promptCallIndex = 0;
    promptResponses = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should always have terminal enabled', async () => {
    promptResponses = [[]];  // skip all channels

    const { runNotificationsStep } = await import('./notifications.js');
    const result = await runNotificationsStep(credentialStore, passphrase);

    expect(result.notifications.terminal).toBe(true);
  });

  it('should configure email notifications', async () => {
    promptResponses = [
      ['email'],           // select email
      'smtp.gmail.com',   // host
      '587',              // port
      'user@gmail.com',   // user
      'app-password',     // password
      'from@gmail.com',   // from
      'to@gmail.com',     // to
    ];

    const { runNotificationsStep } = await import('./notifications.js');
    const result = await runNotificationsStep(credentialStore, passphrase);

    expect(result.notifications.email.enabled).toBe(true);
    expect(result.notifications.email.smtpHost).toBe('smtp.gmail.com');
    expect(result.notifications.email.smtpPort).toBe(587);
    expect(credentialStore.has('email.smtpPassword')).toBe(true);
  });

  it('should configure webhook notifications', async () => {
    promptResponses = [
      ['webhook'],                      // select webhook
      'https://hooks.example.com/abc',  // url
    ];

    const { runNotificationsStep } = await import('./notifications.js');
    const result = await runNotificationsStep(credentialStore, passphrase);

    expect(result.notifications.webhook.enabled).toBe(true);
    expect(result.notifications.webhook.url).toBe('https://hooks.example.com/abc');
  });

  it('should skip all additional channels', async () => {
    promptResponses = [[]];

    const { runNotificationsStep } = await import('./notifications.js');
    const result = await runNotificationsStep(credentialStore, passphrase);

    expect(result.notifications.email.enabled).toBe(false);
    expect(result.notifications.webhook.enabled).toBe(false);
  });
});
