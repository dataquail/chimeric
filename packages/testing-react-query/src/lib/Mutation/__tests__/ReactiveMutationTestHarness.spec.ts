import { ReactiveMutationFactory } from '@chimeric/react-query';
import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ReactiveMutationTestHarness', () => {
  it('should be a function', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithoutParamsReturnsString();
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
    const mockFn = makeAsyncFnWithParamsReturnsString();
    const reactiveMutation = ReactiveMutationFactory({
      mutationFn: mockFn,
    });
    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.call({ name: 'John' });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });
});
