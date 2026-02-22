import { describe, it, expect, beforeEach } from 'vitest';
import { PlatformRegistry } from './index.js';
import { createMockPlatformAdapter } from '../../tests/helpers/index.js';

describe('PlatformRegistry', () => {
  let registry: PlatformRegistry;

  beforeEach(() => {
    registry = new PlatformRegistry();
  });

  it('should register and get a platform adapter', () => {
    const adapter = createMockPlatformAdapter({ id: 'resy', name: 'Resy' });
    registry.register(adapter);
    expect(registry.get('resy')).toBe(adapter);
  });

  it('should throw on unknown platform', () => {
    expect(() => registry.get('unknown')).toThrow('Unknown platform: unknown');
  });

  it('should return all registered adapters', () => {
    const resy = createMockPlatformAdapter({ id: 'resy', name: 'Resy' });
    const ot = createMockPlatformAdapter({ id: 'opentable', name: 'OpenTable' });
    registry.register(resy);
    registry.register(ot);
    expect(registry.getAll()).toHaveLength(2);
  });

  it('should check if platform exists', () => {
    expect(registry.has('resy')).toBe(false);
    registry.register(createMockPlatformAdapter({ id: 'resy', name: 'Resy' }));
    expect(registry.has('resy')).toBe(true);
  });
});
