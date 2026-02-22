import * as clack from '@clack/prompts';
import type { Option } from '@clack/prompts';

export class CancelError extends Error {
  constructor() {
    super('User cancelled');
    this.name = 'CancelError';
  }
}

function assertNotCancelled<T>(value: T | symbol): T {
  if (clack.isCancel(value)) {
    throw new CancelError();
  }
  return value;
}

export async function promptText(options: {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string | undefined) => string | Error | undefined;
}): Promise<string> {
  const result = await clack.text(options);
  return assertNotCancelled(result);
}

export async function promptPassword(options: {
  message: string;
  validate?: (value: string | undefined) => string | Error | undefined;
}): Promise<string> {
  const result = await clack.password(options);
  return assertNotCancelled(result);
}

export async function promptSelect<Value>(options: {
  message: string;
  options: Option<Value>[];
}): Promise<Value> {
  const result = await clack.select<Value>(options);
  return assertNotCancelled(result);
}

export async function promptMultiselect<Value>(options: {
  message: string;
  options: Option<Value>[];
  required?: boolean;
}): Promise<Value[]> {
  const result = await clack.multiselect<Value>(options);
  return assertNotCancelled(result);
}

export async function promptConfirm(options: {
  message: string;
  active?: string;
  inactive?: string;
  initialValue?: boolean;
}): Promise<boolean> {
  const result = await clack.confirm(options);
  return assertNotCancelled(result);
}

export { clack };
