import { IdiomaticReadTestHarness } from '../IdiomaticReadTestHarness';
import { createIdiomaticRead } from '@chimeric/core';

describe('IdiomaticReadTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockFn = vi.fn(() => 'test');
    const read = IdiomaticReadTestHarness({
      idiomaticRead: createIdiomaticRead(mockFn),
    });

    expect(read.result.current).toBe('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    let result: string | null = 'test1';
    const mockFn = vi.fn(() => result);
    const read = IdiomaticReadTestHarness({
      idiomaticRead: createIdiomaticRead(mockFn),
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
});
