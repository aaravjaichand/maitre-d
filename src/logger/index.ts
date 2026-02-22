import pino from 'pino';

export interface LoggerOptions {
  /** Log level (default: from LOG_LEVEL env var or 'info') */
  level?: string;
  /** Enable pretty-printing (default: false) */
  pretty?: boolean;
}

/**
 * Create a configured pino logger with sensitive field redaction.
 */
export function createLogger(options: LoggerOptions = {}): pino.Logger {
  const level = options.level ?? process.env.LOG_LEVEL ?? 'info';

  const transport = options.pretty
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined;

  return pino({
    level,
    transport,
    redact: {
      paths: [
        'password',
        'token',
        'authToken',
        'refreshToken',
        'apiKey',
        'secret',
        'sessionCookie',
        '*.password',
        '*.token',
        '*.authToken',
        '*.refreshToken',
        '*.apiKey',
        '*.secret',
        '*.sessionCookie',
      ],
      censor: '[REDACTED]',
    },
  });
}

/**
 * Create a child logger scoped to a specific module.
 */
export function createChildLogger(parent: pino.Logger, moduleName: string): pino.Logger {
  return parent.child({ module: moduleName });
}
