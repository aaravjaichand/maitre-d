import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerWatchCommand(program: Command): void {
  program
    .command('watch [query...]')
    .description('Monitor restaurants for cancellation openings')
    .option('-d, --date <date>', 'date to watch')
    .option('-p, --party <size>', 'party size', '2')
    .option('-t, --time <range>', 'preferred time range')
    .option('--accept-time <range>', 'acceptable time range')
    .option('--seating <type>', 'seating preference (indoor, outdoor, bar)')
    .option('--auto-book', 'automatically book when available')
    .option('--days <n>', 'number of days to watch')
    .option('--until <date>', 'watch until date')
    .option('--name <label>', 'name for this watch')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('watch');
    })));
}
