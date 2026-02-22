import type { Command } from 'commander';
import { withErrorHandler } from '../middleware/error-handler.js';
import { withConfigCheck } from '../middleware/config-check.js';
import { printNotImplemented } from '../ui/output.js';

export function registerChatCommand(program: Command): void {
  program
    .command('chat')
    .description('Open an interactive AI chat session')
    .action(withErrorHandler(withConfigCheck(async () => {
      printNotImplemented('chat');
    })));
}
