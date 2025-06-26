import { IdiomaticMutationFactory } from '@chimeric/react-query';
import { IdiomaticMutationTestHarness } from '../IdiomaticMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('IdiomaticMutationTestHarness', () => {
  it('should wait for success', async () => {
    const queryClient = new QueryClient();
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: mockPromise,
    });
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    expect(mutation.result.current.isIdle).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.isSuccess).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe(undefined);

    mutation.result.current.call();

    expect(mutation.result.current.isIdle).toBe(false);
    expect(mutation.result.current.isPending).toBe(true);
    expect(mutation.result.current.isSuccess).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe(undefined);

    await mutation.waitFor(() =>
      expect(mutation.result.current.isSuccess).toBe(true),
    );

    expect(mutation.result.current.isSuccess).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should handle params', async () => {
    const queryClient = new QueryClient();
    const mockPromise = makeAsyncFnWithParamsReturnsString();
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: mockPromise,
    });
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    const result = await mutation.result.current.call({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });
});
