import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerFindCommand(program: Command): void {
  program
    .command('find [query...]')
    .description('Search for restaurants and availability')
    .option('-d, --date <date>', 'date for reservation')
    .option('-p, --party <size>', 'party size', '2')
    .option('-t, --time <range>', 'preferred time range (e.g., 7pm-9pm)')
    .option('--cuisine <type>', 'cuisine type filter')
    .option('--neighborhood <area>', 'neighborhood filter')
    .option('--platform <name>', 'platform to search (resy, opentable)')
    .option('--sort <field>', 'sort results by field')
    .option('--limit <n>', 'max results to show')
    .option('--json', 'output as JSON')
    .option('--no-ai', 'disable AI-powered search')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('find');
    })));
}
