import { makeSyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { IdiomaticSyncTestHarness } from '../IdiomaticSyncTestHarness';

describe('IdiomaticReadTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockFn = makeSyncFnWithoutParamsReturnsString();
    const read = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
    });

    expect(read.result.current).toBe('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    let result: string | null = 'test1';
    const mockFn = vi.fn(() => result);
    const read = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
    });

    expect(read.result.current).toBe('test1');

    wait(100).then(() => {
      result = 'test2';
    });

    try {
      // stays 'test1' until reinvoke
      await read.waitFor(() => expect(read.result.current).toBe('test2'), {
        timeout: 200,
      });
    } catch (error: unknown) {
      expect((error as Error).message).toBe(
        `expected 'test1' to be 'test2' // Object.is equality`,
      );
    }

    await read.waitFor(() => expect(read.result.current).toBe('test2'), {
      reinvokeIdiomaticFn: true,
    });

    expect(read.result.current).toBe('test2');
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle params', async () => {
    const mockFn = vi.fn((params: { name: string }) => `Hello ${params.name}`);
    const read = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
      params: { name: 'John' },
    });

    expect(read.result.current).toBe('Hello John');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      name: 'John',
    });

    try {
      IdiomaticSyncTestHarness({
        // @ts-expect-error Testing invalid usage
        idiomaticSync: mockFn,
        params: 1,
      });
    } catch {
      // Expected error
    }
  });

  it('should handle optional params', async () => {
    const mockFn = vi.fn((params?: { name: string }) =>
      params?.name ? `Hello ${params.name}` : 'Hello',
    );
    const read = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
      params: { name: 'John' },
    });

    expect(read.result.current).toBe('Hello John');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      name: 'John',
    });

    const testHarnessNoParams = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith(undefined);

    try {
      IdiomaticSyncTestHarness({
        idiomaticSync: mockFn,
        // @ts-expect-error Testing invalid usage
        params: 1,
      });
    } catch {
      // Expected error
    }
  });

  it('should handle no params', async () => {
    const mockFn = makeSyncFnWithoutParamsReturnsString();
    const read = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
    });

    expect(read.result.current).toBe('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
