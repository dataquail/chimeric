import { createReactiveAsync } from '@chimeric/core';
import { ReactiveAsyncTestHarness } from '../ReactiveAsyncTestHarness';

describe('ReactiveAsyncTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should be a function', () => {
    const mockFn = vi.fn(() => Promise.resolve('test'));
    const mockReactiveAsync = createReactiveAsync(
      vi.fn(() => ({
        call: mockFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
    });

    harness.result.current.call();

    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should accept options', async () => {
    const mockFn = vi.fn(async () => {
      await wait(100);
      return 'test';
    });
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: mockFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
      reactiveOptions: { retry: 3 },
    });

    await harness.result.current.call();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 3 });
  });

  it('should take options with params', async () => {
    const mockFn = vi.fn(async (params: { name: string }) => {
      await wait(100);
      return params.name;
    });
    const mockReactiveAsync = createReactiveAsync(
      vi.fn(() => ({
        call: mockFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
      reactiveOptions: { retry: 3 },
    });

    harness.result.current.call({ name: 'John' });

    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 3 });
  });
});
