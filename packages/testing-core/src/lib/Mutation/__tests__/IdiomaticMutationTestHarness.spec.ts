import { MutationTestFixtures } from '../../__tests__/mutationFixtures';
import { IdiomaticMutationTestHarness } from '../IdiomaticMutationTestHarness';

describe('IdiomaticMutationTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    expect(mutation.result.current.isIdle).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.isSuccess).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe(undefined);

    mutation.result.current.invoke();

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
    expect(idiomaticMutation).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    expect(mutation.result.current.isIdle).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.isSuccess).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe(undefined);

    mutation.result.current.invoke({ name: 'John' });

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
    expect(mutation.result.current.data).toBe('Hello John');
    expect(idiomaticMutation).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    expect(mutation.result.current.isIdle).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.isSuccess).toBe(false);
    expect(mutation.result.current.isError).toBe(false);
    expect(mutation.result.current.error).toBe(null);
    expect(mutation.result.current.data).toBe(undefined);

    mutation.result.current.invoke();

    expect(mutation.result.current.isIdle).toBe(false);
    expect(mutation.result.current.isPending).toBe(true);

    await mutation.waitFor(() =>
      expect(mutation.result.current.isSuccess).toBe(true),
    );

    expect(mutation.result.current.isSuccess).toBe(true);
    expect(mutation.result.current.isPending).toBe(false);
    expect(mutation.result.current.data).toBe('Hello');
    expect(idiomaticMutation).toHaveBeenCalledTimes(1);

    mutation.result.current.invoke({ name: 'Jane' });

    expect(mutation.result.current.isPending).toBe(true);

    await mutation.waitFor(() =>
      expect(mutation.result.current.isSuccess).toBe(true),
    );

    expect(mutation.result.current.data).toBe('Hello Jane');
    expect(idiomaticMutation).toHaveBeenCalledTimes(2);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because params are not expected
      mutation.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because params are expected
      mutation.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      mutation.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      mutation.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because wrong params
      mutation.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      mutation.result.current.invoke(1);

      mutation.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
