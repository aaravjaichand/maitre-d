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

describe('runPlatformsStep', () => {
  let tempDir: string;
  let credentialStore: CredentialStore;
  const passphrase = 'test-pass';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-platforms-test-'));
    credentialStore = new CredentialStore(join(tempDir, 'credentials.json'));
    promptCallIndex = 0;
    promptResponses = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should handle selecting one platform', async () => {
    promptResponses = [
      ['resy'],           // select resy
      'user@test.com',    // email
      'password123',      // password
    ];

    const { runPlatformsStep } = await import('./platforms.js');
    const result = await runPlatformsStep(credentialStore, passphrase);

    expect(result.platforms.resy).toEqual({ enabled: true });
    expect(credentialStore.has('resy.email')).toBe(true);
    expect(credentialStore.has('resy.password')).toBe(true);
  });

  it('should handle selecting both platforms', async () => {
    promptResponses = [
      ['resy', 'opentable'],  // select both
      'resy@test.com',        // resy email
      'resypass',             // resy password
      'ot@test.com',          // opentable email
      'otpass',               // opentable password
    ];

    const { runPlatformsStep } = await import('./platforms.js');
    const result = await runPlatformsStep(credentialStore, passphrase);

    expect(result.platforms.resy).toEqual({ enabled: true });
    expect(result.platforms.opentable).toEqual({ enabled: true });
  });

  it('should handle skipping all platforms', async () => {
    promptResponses = [
      [],  // skip all
    ];

    const { runPlatformsStep } = await import('./platforms.js');
    const result = await runPlatformsStep(credentialStore, passphrase);

    expect(Object.keys(result.platforms)).toHaveLength(0);
  });

  it('should handle cancellation', async () => {
    const clack = await import('@clack/prompts');
    const cancelSym = Symbol('cancel');
    promptResponses = [cancelSym];
    vi.mocked(clack.isCancel).mockImplementation((value) => value === cancelSym);

    const { runPlatformsStep } = await import('./platforms.js');
    const { CancelError } = await import('../../../../cli/ui/prompts.js');

    await expect(
      runPlatformsStep(credentialStore, passphrase),
    ).rejects.toThrow(CancelError);

    vi.mocked(clack.isCancel).mockImplementation(() => false);
  });
});
