import type { LLMProvider } from '../types/index.js';

/**
 * Registry for LLM providers (OpenAI, Anthropic, Google, Ollama, etc.).
 * Tracks the default provider for AI operations.
 */
export class LLMRegistry {
  private providers = new Map<string, LLMProvider>();
  private defaultId: string | null = null;

  /** Register an LLM provider. */
  register(provider: LLMProvider): void {
    this.providers.set(provider.id, provider);
  }

  /** Get an LLM provider by ID. Throws if not found. */
  get(providerId: string): LLMProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Unknown LLM provider: ${providerId}`);
    }
    return provider;
  }

  /** Get all registered LLM providers. */
  getAll(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  /** Check if an LLM provider is registered. */
  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  /** Set the default LLM provider by ID. */
  setDefault(providerId: string): void {
    if (!this.providers.has(providerId)) {
      throw new Error(`Unknown LLM provider: ${providerId}`);
    }
    this.defaultId = providerId;
  }

  /** Get the default LLM provider, or null if none is set. */
  getDefault(): LLMProvider | null {
    if (!this.defaultId) return null;
    return this.providers.get(this.defaultId) ?? null;
  }
}
