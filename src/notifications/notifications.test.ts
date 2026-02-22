import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationRegistry } from './index.js';
import { createMockNotificationChannel } from '../../tests/helpers/index.js';

describe('NotificationRegistry', () => {
  let registry: NotificationRegistry;

  beforeEach(() => {
    registry = new NotificationRegistry();
  });

  it('should register and get a channel', () => {
    const channel = createMockNotificationChannel({ id: 'email', name: 'Email' });
    registry.register(channel);
    expect(registry.get('email')).toBe(channel);
  });

  it('should throw on unknown channel', () => {
    expect(() => registry.get('unknown')).toThrow('Unknown notification channel: unknown');
  });

  it('should return all registered channels', () => {
    registry.register(createMockNotificationChannel({ id: 'email', name: 'Email' }));
    registry.register(createMockNotificationChannel({ id: 'webhook', name: 'Webhook' }));
    expect(registry.getAll()).toHaveLength(2);
  });

  it('should return only enabled channels', () => {
    registry.register(createMockNotificationChannel({ id: 'email', name: 'Email', enabled: true }));
    registry.register(
      createMockNotificationChannel({ id: 'webhook', name: 'Webhook', enabled: false }),
    );
    const enabled = registry.getEnabled();
    expect(enabled).toHaveLength(1);
    expect(enabled[0].id).toBe('email');
  });

  it('should check if channel exists', () => {
    expect(registry.has('email')).toBe(false);
    registry.register(createMockNotificationChannel({ id: 'email', name: 'Email' }));
    expect(registry.has('email')).toBe(true);
  });
});
