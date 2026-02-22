import { describe, it, expect, beforeEach } from 'vitest';
import { Container, TOKENS } from './index.js';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('should register and resolve a service', () => {
    container.register('test', () => ({ value: 42 }));
    const result = container.resolve<{ value: number }>('test');
    expect(result.value).toBe(42);
  });

  it('should return the same instance on multiple resolves (singleton)', () => {
    let callCount = 0;
    container.register('counter', () => {
      callCount++;
      return { count: callCount };
    });

    const first = container.resolve<{ count: number }>('counter');
    const second = container.resolve<{ count: number }>('counter');

    expect(first).toBe(second);
    expect(callCount).toBe(1);
  });

  it('should throw on unknown token', () => {
    expect(() => container.resolve('nonexistent')).toThrow(
      'No registration found for token: nonexistent',
    );
  });

  it('should report has correctly', () => {
    expect(container.has('test')).toBe(false);
    container.register('test', () => 'value');
    expect(container.has('test')).toBe(true);
  });

  it('should clear all registrations on reset', () => {
    container.register('test', () => 'value');
    container.resolve('test');
    container.reset();
    expect(container.has('test')).toBe(false);
  });

  it('should have well-known tokens defined', () => {
    expect(TOKENS.config).toBe('config');
    expect(TOKENS.logger).toBe('logger');
    expect(TOKENS.dataStore).toBe('dataStore');
    expect(TOKENS.platformRegistry).toBe('platformRegistry');
  });
});
