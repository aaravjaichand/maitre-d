import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createProgram } from '../index.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ConfigManager } from '../../config/index.js';

// Mock @clack/prompts to prevent interactive prompts
vi.mock('@clack/prompts', () => ({
  text: vi.fn(),
  password: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  confirm: vi.fn(),
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  log: { step: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn(), message: vi.fn() },
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));

describe('command stubs', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'maitre-d-stubs-test-'));
    // Set up an initialized config so config-check passes
    const config = new ConfigManager({ cwd: tempDir });
    config.set('_initialized', true);

    // Mock ConfigManager to use our temp directory
    vi.spyOn(ConfigManager.prototype, 'getAll').mockReturnValue({
      ...config.getAll(),
      _initialized: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  const stubs = ['find', 'watch', 'snipe', 'list', 'chat'];

  it.each(stubs)('%s prints not yet implemented', async (cmd) => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const program = createProgram();
    program.exitOverride();

    await program.parseAsync(['node', 'maitre-d', cmd]);

    const output = consoleSpy.mock.calls.flat().join('\n');
    expect(output).toContain('not yet implemented');
    consoleSpy.mockRestore();
  });

  it('cancel prints not yet implemented', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const program = createProgram();
    program.exitOverride();

    await program.parseAsync(['node', 'maitre-d', 'cancel', 'watch', '123']);

    const output = consoleSpy.mock.calls.flat().join('\n');
    expect(output).toContain('not yet implemented');
    consoleSpy.mockRestore();
  });
});
