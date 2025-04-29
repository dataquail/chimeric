import { ReactiveAsyncTestHarness } from '../ReactiveAsyncTestHarness';

describe('ReactiveAsyncTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should be a function', () => {
    const mockFn = vi.fn(() => Promise.resolve('test'));
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
});
