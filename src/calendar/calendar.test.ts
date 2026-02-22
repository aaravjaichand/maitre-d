import { describe, it, expect, beforeEach } from 'vitest';
import { CalendarRegistry } from './index.js';
import { createMockCalendarAdapter } from '../../tests/helpers/index.js';

describe('CalendarRegistry', () => {
  let registry: CalendarRegistry;

  beforeEach(() => {
    registry = new CalendarRegistry();
  });

  it('should register and get a calendar adapter', () => {
    const adapter = createMockCalendarAdapter({ id: 'google', name: 'Google Calendar' });
    registry.register(adapter);
    expect(registry.get('google')).toBe(adapter);
  });

  it('should throw on unknown provider', () => {
    expect(() => registry.get('unknown')).toThrow('Unknown calendar provider: unknown');
  });

  it('should return null for getActive when none is set', () => {
    expect(registry.getActive()).toBeNull();
  });

  it('should set and get active calendar', () => {
    const adapter = createMockCalendarAdapter({ id: 'google', name: 'Google Calendar' });
    registry.register(adapter);
    registry.setActive('google');
    expect(registry.getActive()).toBe(adapter);
  });

  it('should throw when setting active to unknown provider', () => {
    expect(() => registry.setActive('unknown')).toThrow('Unknown calendar provider: unknown');
  });

  it('should check if provider exists', () => {
    expect(registry.has('google')).toBe(false);
    registry.register(createMockCalendarAdapter({ id: 'google', name: 'Google Calendar' }));
    expect(registry.has('google')).toBe(true);
  });
});
