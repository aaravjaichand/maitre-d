import { Command } from 'commander';
import { createRequire } from 'node:module';
import { registerFindCommand } from './commands/find.js';
import { registerWatchCommand } from './commands/watch.js';
import { registerSnipeCommand } from './commands/snipe.js';
import { registerListCommand } from './commands/list.js';
import { registerCancelCommand } from './commands/cancel.js';
import { registerChatCommand } from './commands/chat.js';
import { registerConfigCommand } from './commands/config/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { version: string };

export function createProgram(): Command {
  const program = new Command();

  program
    .name('maitre-d')
    .description('The open-source, AI-powered restaurant reservation agent')
    .version(pkg.version);

  registerFindCommand(program);
  registerWatchCommand(program);
  registerSnipeCommand(program);
  registerListCommand(program);
  registerCancelCommand(program);
  registerChatCommand(program);
  registerConfigCommand(program);

  return program;
}

export async function run(): Promise<void> {
  const program = createProgram();
  await program.parseAsync(process.argv);
}
