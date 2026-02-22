import { ZodError } from 'zod';
import { printError, fmt } from '../ui/output.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAction = (...args: any[]) => any;

export function withErrorHandler<T extends AnyAction>(action: T): T {
  const wrapped = async (...args: Parameters<T>) => {
    try {
      await action(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        printError('Configuration validation failed:');
        for (const issue of error.issues) {
          console.error(`  ${fmt.dim(issue.path.join('.'))} — ${issue.message}`);
        }
      } else if (error instanceof Error) {
        printError(error.message);
        if (process.env['VERBOSE'] || process.env['DEBUG']) {
          console.error(fmt.dim(error.stack ?? ''));
        }
      } else {
        printError(String(error));
      }
      process.exit(1);
    }
  };
  return wrapped as unknown as T;
}
