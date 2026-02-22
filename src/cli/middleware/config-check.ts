import { ConfigManager } from '../../config/index.js';
import { printInfo } from '../ui/output.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAction = (...args: any[]) => any;

export function withConfigCheck<T extends AnyAction>(action: T): T {
  const wrapped = async (...args: Parameters<T>) => {
    const configManager = new ConfigManager();
    const config = configManager.getAll();

    if (!config._initialized) {
      console.log();
      printInfo('No configuration found. Run `maitre-d config` to get started.');
      console.log();
      return;
    }

    return action(...args);
  };
  return wrapped as unknown as T;
}
