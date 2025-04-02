import { IdiomaticAsyncReadTestHarness } from '../IdiomaticAsyncReadTestHarness';
import { createIdiomaticAsyncRead } from '@chimeric/core';

describe('IdiomaticAsyncReadTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockPromise = vi.fn(async () => {
      await wait(100);
      return 'test';
    });
    const asyncRead = IdiomaticAsyncReadTestHarness({
      idiomaticAsyncRead: createIdiomaticAsyncRead(mockPromise),
    });

    expect(asyncRead.result.current.isIdle).toBe(false);
    expect(asyncRead.result.current.isPending).toBe(true);
    expect(asyncRead.result.current.isSuccess).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe(undefined);

    await asyncRead.waitFor(() =>
      expect(asyncRead.result.current.isSuccess).toBe(true),
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const asyncRead = IdiomaticAsyncReadTestHarness({
      idiomaticAsyncRead: createIdiomaticAsyncRead(mockPromise),
    });

    expect(asyncRead.result.current.isIdle).toBe(false);
    expect(asyncRead.result.current.isPending).toBe(true);
    expect(asyncRead.result.current.isSuccess).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe(undefined);

    await asyncRead.waitFor(() =>
      expect(asyncRead.result.current.isSuccess).toBe(true),
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);

    await asyncRead.waitFor(
      () => expect(asyncRead.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(2);
  });
});
