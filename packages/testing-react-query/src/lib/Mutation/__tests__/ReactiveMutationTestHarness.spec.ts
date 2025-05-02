import { ReactiveMutationFactory } from '@chimeric/react-query';
import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ReactiveMutationTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should be a function', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const reactiveMutation = ReactiveMutationFactory({
      mutationFn: mockMutationFn,
    });

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    await harness.result.current.call();
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should handle params', async () => {
    const queryClient = new QueryClient();
    const mockFn = vi.fn(async (args: { id: string }) => {
      await wait(100);
      return 'test' + args.id;
    });
    const reactiveMutation = ReactiveMutationFactory({
      mutationFn: mockFn,
    });
    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.call({ id: '123' });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ id: '123' });
    expect(result).toBe('test123');
  });
});
