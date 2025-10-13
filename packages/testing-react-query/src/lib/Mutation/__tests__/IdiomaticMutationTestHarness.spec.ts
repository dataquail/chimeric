import { IdiomaticMutationTestHarness } from '../IdiomaticMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { MutationTestFixtures } from '../../__tests__/mutationFixture';

describe('IdiomaticMutationTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic(queryClient);
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
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic(queryClient);
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
  });

  it('USAGE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic(queryClient);
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

    mutation.result.current.invoke({ name: 'Jane' });

    expect(mutation.result.current.isPending).toBe(true);

    await mutation.waitFor(() =>
      expect(mutation.result.current.isSuccess).toBe(true),
    );

    expect(mutation.result.current.data).toBe('Hello Jane');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic(queryClient);
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because params are not expected
      await mutation.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic(queryClient);
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because params are expected
      await mutation.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      await mutation.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      await mutation.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic(queryClient);
    const mutation = IdiomaticMutationTestHarness({
      idiomaticMutation,
    });

    try {
      // @ts-expect-error - should error because wrong params
      await mutation.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      await mutation.result.current.invoke(1);

      await mutation.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
