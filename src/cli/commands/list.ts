import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerListCommand(program: Command): void {
  program
    .command('list [type]')
    .description('View active watches, snipes, and reservations')
    .option('-a, --all', 'show all including completed')
    .option('--detail', 'show detailed information')
    .option('--json', 'output as JSON')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('list');
    })));
}
