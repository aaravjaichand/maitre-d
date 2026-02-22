import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerSnipeCommand(program: Command): void {
  program
    .command('snipe [query...]')
    .description('Set up a reservation drop snipe')
    .option('-d, --date <date>', 'date for reservation')
    .option('-p, --party <size>', 'party size', '2')
    .option('-t, --time <range>', 'preferred time range')
    .option('--accept-time <range>', 'acceptable time range')
    .option('--seating <type>', 'seating preference (indoor, outdoor, bar)')
    .option('--drop-time <time>', 'expected reservation drop time')
    .option('--dry-run', 'preview without booking')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('snipe');
    })));
}
