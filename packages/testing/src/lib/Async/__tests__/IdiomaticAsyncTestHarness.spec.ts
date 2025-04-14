import { IdiomaticAsyncTestHarness } from '../IdiomaticAsyncTestHarness';

describe('IdiomaticAsyncTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockPromise = vi.fn(async () => {
      await wait(100);
      return 'test';
    });
    const promise = IdiomaticAsyncTestHarness({
      idiomaticAsync: mockPromise,
    });

    expect(promise.result.current.isIdle).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    promise.result.current.call();

    expect(promise.result.current.isIdle).toBe(false);
    expect(promise.result.current.isPending).toBe(true);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    await promise.waitFor(() =>
      expect(promise.result.current.isSuccess).toBe(true),
    );

    expect(promise.result.current.isSuccess).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });
});
