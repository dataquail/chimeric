import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { MutationTestFixtures } from '../../__tests__/mutationFixture';

describe('ReactiveMutationTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation, invokeFn } =
      MutationTestFixtures.withoutParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke();

    expect(invokeFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation, fn } =
      MutationTestFixtures.withParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke({ name: 'John' });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('USAGE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation, fn } =
      MutationTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    const result1 = await harness.result.current.invoke();

    expect(fn).toHaveBeenCalledWith(undefined);
    expect(result1).toBe('Hello');

    const result2 = await harness.result.current.invoke({ name: 'Jane' });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation } =
      MutationTestFixtures.withoutParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because params are not expected
      await harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation } = MutationTestFixtures.withParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because params are expected
      await harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      await harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      await harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because wrong params
      await harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      await harness.result.current.invoke(1);

      await harness.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
