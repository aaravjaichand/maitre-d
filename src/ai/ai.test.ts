import { describe, it, expect, beforeEach } from 'vitest';
import { LLMRegistry } from './index.js';
import { createMockLLMProvider } from '../../tests/helpers/index.js';

describe('LLMRegistry', () => {
  let registry: LLMRegistry;

  beforeEach(() => {
    registry = new LLMRegistry();
  });

  it('should register and get a provider', () => {
    const provider = createMockLLMProvider({ id: 'openai', name: 'OpenAI' });
    registry.register(provider);
    expect(registry.get('openai')).toBe(provider);
  });

  it('should throw on unknown provider', () => {
    expect(() => registry.get('unknown')).toThrow('Unknown LLM provider: unknown');
  });

  it('should return null for getDefault when none is set', () => {
    expect(registry.getDefault()).toBeNull();
  });

  it('should set and get default provider', () => {
    const provider = createMockLLMProvider({ id: 'openai', name: 'OpenAI' });
    registry.register(provider);
    registry.setDefault('openai');
    expect(registry.getDefault()).toBe(provider);
  });

  it('should throw when setting default to unknown provider', () => {
    expect(() => registry.setDefault('unknown')).toThrow('Unknown LLM provider: unknown');
  });

  it('should check if provider exists', () => {
    expect(registry.has('openai')).toBe(false);
    registry.register(createMockLLMProvider({ id: 'openai', name: 'OpenAI' }));
    expect(registry.has('openai')).toBe(true);
  });
});
