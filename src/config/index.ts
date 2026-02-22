import Conf from 'conf';
import { MaitredConfigSchema, type ValidatedConfig } from './schema.js';
import { DEFAULT_CONFIG } from './defaults.js';

/** Environment variable prefix for config overrides */
const ENV_PREFIX = 'MAITRED_';

/** Map of env var suffixes to config paths */
const ENV_OVERRIDES: Record<string, string> = {
  LOG_LEVEL: 'logging.level',
  AI_PROVIDER: 'ai.provider',
  AI_MODEL: 'ai.model',
  AI_ENABLED: 'ai.enabled',
  DEFAULT_PARTY_SIZE: 'booking.defaultPartySize',
};

export class ConfigManager {
  private store: Conf<Record<string, unknown>>;
  private validated: ValidatedConfig;

  constructor(options?: { cwd?: string; configName?: string }) {
    this.store = new Conf<Record<string, unknown>>({
      projectName: 'maitre-d',
      defaults: DEFAULT_CONFIG as unknown as Record<string, unknown>,
      ...(options?.cwd ? { cwd: options.cwd } : {}),
      ...(options?.configName ? { configName: options.configName } : {}),
    });

    this.validated = this.validate();
  }

  /** Load and validate the config, applying env var overrides. */
  private validate(): ValidatedConfig {
    const raw = this.store.store;
    const withEnv = this.applyEnvOverrides(raw as Record<string, unknown>);
    return MaitredConfigSchema.parse(withEnv);
  }

  /** Apply environment variable overrides to config. */
  private applyEnvOverrides(config: Record<string, unknown>): Record<string, unknown> {
    const result = { ...config };

    for (const [envSuffix, configPath] of Object.entries(ENV_OVERRIDES)) {
      const envValue = process.env[`${ENV_PREFIX}${envSuffix}`];
      if (envValue !== undefined) {
        this.setNestedValue(result, configPath, this.parseEnvValue(envValue));
      }
    }

    return result;
  }

  private parseEnvValue(value: string): unknown {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;
    return value;
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    let current: Record<string, unknown> = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  }

  /** Get the full validated config. */
  getAll(): ValidatedConfig {
    return this.validated;
  }

  /** Get a top-level config section. */
  get<K extends keyof ValidatedConfig>(key: K): ValidatedConfig[K] {
    return this.validated[key];
  }

  /** Set a top-level config value and persist. */
  set<K extends keyof ValidatedConfig>(key: K, value: ValidatedConfig[K]): void {
    this.store.set(key, value);
    this.validated = this.validate();
  }

  /** Reload config from disk. */
  reload(): void {
    this.validated = this.validate();
  }

  /** Get the path to the config file. */
  get path(): string {
    return this.store.path;
  }
}

export { DEFAULT_CONFIG } from './defaults.js';
export { MaitredConfigSchema, type ValidatedConfig } from './schema.js';
