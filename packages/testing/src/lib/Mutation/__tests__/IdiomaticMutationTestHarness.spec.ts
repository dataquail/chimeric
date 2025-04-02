import { IdiomaticMutationTestHarness } from '../IdiomaticMutationTestHarness';
import { createIdiomaticMutation } from '@chimeric/core';

describe('IdiomaticMutationTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('should wait for success', async () => {
    const mockPromise = vi.fn(async () => {
      await wait(100);
      return 'test';
    });
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation: createIdiomaticMutation(mockPromise),
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
});
