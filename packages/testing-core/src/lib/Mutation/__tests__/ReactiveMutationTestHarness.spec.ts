import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';

describe('ReactiveMutationTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should be a function', () => {
    const mockFn = vi.fn(() => Promise.resolve('test'));
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: mockFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
        native: {},
      })),
    };

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: mockReactiveMutation,
    });

    harness.result.current.call();

    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle params', async () => {
    const mockFn = vi.fn(async (args: { id: string }) => {
      await wait(100);
      return 'test' + args.id;
    });
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: mockFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
        native: {},
      })),
    };

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: mockReactiveMutation,
    });

    const result = await harness.result.current.call({ id: '123' });
    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ id: '123' });
    expect(result).toBe('test123');
  });
});
