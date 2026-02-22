import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerCancelCommand(program: Command): void {
  program
    .command('cancel <type> <id>')
    .description('Cancel a watch, snipe, or reservation')
    .option('-f, --force', 'skip confirmation prompt')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('cancel');
    })));
}
