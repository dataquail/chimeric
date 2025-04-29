import { IdiomaticQueryTestHarness } from '../IdiomaticQueryTestHarness';

describe('IdiomaticQueryTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockPromise = vi.fn(async () => {
      await wait(100);
      return 'test';
    });
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(2);
  });
});
