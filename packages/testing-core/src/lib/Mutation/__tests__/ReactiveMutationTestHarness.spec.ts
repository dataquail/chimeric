import { MutationTestFixtures } from '../../__tests__/mutationFixtures';
import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';

describe('ReactiveMutationTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { reactiveMutation, invokeFn } =
      MutationTestFixtures.withoutParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    const result = await harness.result.current.invoke();

    expect(reactiveMutation.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { reactiveMutation, invokeFn } =
      MutationTestFixtures.withParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    const result = await harness.result.current.invoke({ name: 'John' });

    expect(reactiveMutation.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledTimes(1);
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('USAGE: with optional params', async () => {
    const { reactiveMutation, invokeFn } =
      MutationTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    const result1 = await harness.result.current.invoke();

    expect(reactiveMutation.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledWith();
    expect(result1).toBe('Hello');

    const result2 = await harness.result.current.invoke({ name: 'Jane' });

    expect(invokeFn).toHaveBeenCalledTimes(2);
    expect(invokeFn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveMutation } =
      MutationTestFixtures.withoutParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveMutation } = MutationTestFixtures.withParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    try {
      // @ts-expect-error - should error because params are expected
      harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation,
    });

    try {
      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);

      harness.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
