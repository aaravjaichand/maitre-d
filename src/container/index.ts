/**
 * Well-known service tokens for dependency injection.
 */
export const TOKENS = {
  config: 'config',
  logger: 'logger',
  credentialStore: 'credentialStore',
  dataStore: 'dataStore',
  platformRegistry: 'platformRegistry',
  calendarRegistry: 'calendarRegistry',
  llmRegistry: 'llmRegistry',
  notificationRegistry: 'notificationRegistry',
  eventBus: 'eventBus',
} as const;

type Factory<T> = () => T;

/**
 * Simple Map-based dependency injection container.
 * Supports lazy singleton instantiation — factories are called once
 * on first resolve and the result is cached.
 */
export class Container {
  private factories = new Map<string, Factory<unknown>>();
  private instances = new Map<string, unknown>();

  /**
   * Register a factory function for a service token.
   * The factory will be called lazily on first resolve.
   */
  register<T>(token: string, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
    // Clear cached instance if re-registering
    this.instances.delete(token);
  }

  /**
   * Resolve a service by its token. Creates the instance on first call.
   * @throws Error if the token has not been registered.
   */
  resolve<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`No registration found for token: ${token}`);
    }

    const instance = factory();
    this.instances.set(token, instance);
    return instance as T;
  }

  /** Check if a token has been registered. */
  has(token: string): boolean {
    return this.factories.has(token);
  }

  /** Clear all registrations and cached instances. */
  reset(): void {
    this.factories.clear();
    this.instances.clear();
  }
}
