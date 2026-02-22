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

describe('runAIStep', () => {
  let tempDir: string;
  let credentialStore: CredentialStore;
  const passphrase = 'test-pass';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-ai-test-'));
    credentialStore = new CredentialStore(join(tempDir, 'credentials.json'));
    promptCallIndex = 0;
    promptResponses = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should configure a cloud provider with API key', async () => {
    promptResponses = [
      'openai',        // select openai
      'sk-test-key',   // api key
      'gpt-4o',        // model
    ];

    const { runAIStep } = await import('./ai.js');
    const result = await runAIStep(credentialStore, passphrase);

    expect(result.ai.provider).toBe('openai');
    expect(result.ai.model).toBe('gpt-4o');
    expect(result.ai.enabled).toBe(true);
    expect(credentialStore.has('openai.apiKey')).toBe(true);
  });

  it('should configure Ollama with URL', async () => {
    promptResponses = [
      'ollama',                      // select ollama
      'http://localhost:11434',      // base URL
      'llama3.2',                    // model
    ];

    const { runAIStep } = await import('./ai.js');
    const result = await runAIStep(credentialStore, passphrase);

    expect(result.ai.provider).toBe('ollama');
    expect(result.ai.baseUrl).toBe('http://localhost:11434');
    expect(result.ai.model).toBe('llama3.2');
    expect(result.ai.enabled).toBe(true);
  });

  it('should handle skip', async () => {
    promptResponses = ['skip'];

    const { runAIStep } = await import('./ai.js');
    const result = await runAIStep(credentialStore, passphrase);

    expect(result.ai.enabled).toBe(false);
    expect(result.ai.provider).toBeUndefined();
  });

  it('should configure OpenAI-compatible provider', async () => {
    promptResponses = [
      'openai-compatible',         // select compatible
      'https://api.example.com',   // base URL
      'sk-custom-key',             // api key
      'custom-model',              // model
    ];

    const { runAIStep } = await import('./ai.js');
    const result = await runAIStep(credentialStore, passphrase);

    expect(result.ai.provider).toBe('openai-compatible');
    expect(result.ai.baseUrl).toBe('https://api.example.com');
    expect(result.ai.enabled).toBe(true);
    expect(credentialStore.has('openai-compatible.apiKey')).toBe(true);
  });
});
