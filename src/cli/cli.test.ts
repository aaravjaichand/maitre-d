import { describe, it, expect } from 'vitest';
import { createProgram } from './index.js';

describe('CLI program', () => {
  it('should have the correct name', () => {
    const program = createProgram();
    expect(program.name()).toBe('maitre-d');
  });

  it('should have a version', () => {
    const program = createProgram();
    expect(program.version()).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should register all 7 commands', () => {
    const program = createProgram();
    const commandNames = program.commands.map((c) => c.name());
    expect(commandNames).toContain('find');
    expect(commandNames).toContain('watch');
    expect(commandNames).toContain('snipe');
    expect(commandNames).toContain('list');
    expect(commandNames).toContain('cancel');
    expect(commandNames).toContain('chat');
    expect(commandNames).toContain('config');
    expect(commandNames).toHaveLength(7);
  });

  it('should include all commands in help output', () => {
    const program = createProgram();
    const helpText = program.helpInformation();
    expect(helpText).toContain('find');
    expect(helpText).toContain('watch');
    expect(helpText).toContain('snipe');
    expect(helpText).toContain('list');
    expect(helpText).toContain('cancel');
    expect(helpText).toContain('chat');
    expect(helpText).toContain('config');
  });
});
