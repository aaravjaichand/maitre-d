import { describe, it, expect, vi, afterEach } from 'vitest';
import { ZodError, z } from 'zod';
import { withErrorHandler } from './error-handler.js';

describe('withErrorHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass through when action succeeds', async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    const wrapped = withErrorHandler(action);
    await wrapped();
    expect(action).toHaveBeenCalled();
  });

  it('should catch and format generic errors', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const action = vi.fn().mockRejectedValue(new Error('Something broke'));
    const wrapped = withErrorHandler(action);
    await wrapped();

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should handle ZodError with validation details', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const schema = z.object({ name: z.string().min(1) });
    let zodError: ZodError;
    try {
      schema.parse({ name: '' });
    } catch (e) {
      zodError = e as ZodError;
    }

    const action = vi.fn().mockRejectedValue(zodError!);
    const wrapped = withErrorHandler(action);
    await wrapped();

    expect(exitSpy).toHaveBeenCalledWith(1);
    // Check that error messages were printed (ZodError branch)
    const calls = errorSpy.mock.calls.flat().join('\n');
    expect(calls).toContain('name');
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should handle non-Error throws', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const action = vi.fn().mockRejectedValue('string error');
    const wrapped = withErrorHandler(action);
    await wrapped();

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
