import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import Table from 'cli-table3';

const noColor = !!process.env['NO_COLOR'];

const fmt = {
  green: noColor ? (s: string) => s : chalk.green,
  red: noColor ? (s: string) => s : chalk.red,
  yellow: noColor ? (s: string) => s : chalk.yellow,
  cyan: noColor ? (s: string) => s : chalk.cyan,
  bold: noColor ? (s: string) => s : chalk.bold,
  dim: noColor ? (s: string) => s : chalk.dim,
};

const SYM = {
  success: noColor ? '[ok]' : '✓',
  error: noColor ? '[error]' : '✗',
  warning: noColor ? '[warn]' : '⚠',
  info: noColor ? '[info]' : 'ℹ',
};

export function printSuccess(msg: string): void {
  console.log(`${fmt.green(SYM.success)} ${msg}`);
}

export function printError(msg: string): void {
  console.error(`${fmt.red(SYM.error)} ${msg}`);
}

export function printWarning(msg: string): void {
  console.log(`${fmt.yellow(SYM.warning)} ${msg}`);
}

export function printInfo(msg: string): void {
  console.log(`${fmt.cyan(SYM.info)} ${msg}`);
}

export function printNotImplemented(commandName: string): void {
  console.log();
  console.log(
    `${fmt.cyan(SYM.info)} ${fmt.bold(commandName)} is not yet implemented.`,
  );
  console.log(fmt.dim('  This feature is coming soon.'));
  console.log();
}

export function printBanner(): void {
  const banner = `
  ${fmt.bold('maitre-d')}
  The open-source, AI-powered restaurant reservation agent.
`;
  console.log(banner);
}

export function createSpinner(text: string): Ora {
  return ora({ text, isSilent: noColor });
}

export function createTable(options: {
  head: string[];
  colWidths?: number[];
}): InstanceType<typeof Table> {
  return new Table({
    head: options.head.map((h) => fmt.bold(h)),
    ...(options.colWidths ? { colWidths: options.colWidths } : {}),
    style: {
      head: noColor ? [] : ['cyan'],
      border: noColor ? [] : ['dim'],
    },
  });
}

export { fmt };
