import type { CalendarAdapter } from '../types/index.js';

/**
 * Registry for calendar adapters (Google, Apple, Outlook, CalDAV).
 * Tracks the currently active calendar provider.
 */
export class CalendarRegistry {
  private adapters = new Map<string, CalendarAdapter>();
  private activeId: string | null = null;

  /** Register a calendar adapter. */
  register(adapter: CalendarAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  /** Get a calendar adapter by ID. Throws if not found. */
  get(providerId: string): CalendarAdapter {
    const adapter = this.adapters.get(providerId);
    if (!adapter) {
      throw new Error(`Unknown calendar provider: ${providerId}`);
    }
    return adapter;
  }

  /** Get all registered calendar adapters. */
  getAll(): CalendarAdapter[] {
    return Array.from(this.adapters.values());
  }

  /** Check if a calendar provider is registered. */
  has(providerId: string): boolean {
    return this.adapters.has(providerId);
  }

  /** Set the active calendar provider by ID. */
  setActive(providerId: string): void {
    if (!this.adapters.has(providerId)) {
      throw new Error(`Unknown calendar provider: ${providerId}`);
    }
    this.activeId = providerId;
  }

  /** Get the currently active calendar adapter, or null if none is set. */
  getActive(): CalendarAdapter | null {
    if (!this.activeId) return null;
    return this.adapters.get(this.activeId) ?? null;
  }
}
