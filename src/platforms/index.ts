import type { PlatformAdapter } from '../types/index.js';

/**
 * Registry for platform adapters (Resy, OpenTable, etc.).
 * Manages adapter lifecycle and lookup by platform ID.
 */
export class PlatformRegistry {
  private adapters = new Map<string, PlatformAdapter>();

  /** Register a platform adapter. */
  register(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  /** Get a platform adapter by ID. Throws if not found. */
  get(platformId: string): PlatformAdapter {
    const adapter = this.adapters.get(platformId);
    if (!adapter) {
      throw new Error(`Unknown platform: ${platformId}`);
    }
    return adapter;
  }

  /** Get all registered platform adapters. */
  getAll(): PlatformAdapter[] {
    return Array.from(this.adapters.values());
  }

  /** Check if a platform is registered. */
  has(platformId: string): boolean {
    return this.adapters.has(platformId);
  }
}
