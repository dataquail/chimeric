import { fuseChimericMutation } from '@chimeric/react-query';
import { ChimericMutationTestHarness } from '../ChimericMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { MutationTestFixtures } from '../../__tests__/mutationFixture';

describe('ChimericMutationTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation, invokeFn } =
      MutationTestFixtures.withoutParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke();

    expect(invokeFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('USAGE: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation, fn } =
      MutationTestFixtures.withParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke({ name: 'John' });

    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation, fn } =
      MutationTestFixtures.withOptionalParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    const result1 = await harness.result.current.invoke();

    expect(fn).toHaveBeenCalledWith(undefined);
    expect(result1).toBe('Hello');

    const result2 = await harness.result.current.invoke({ name: 'Jane' });

    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    harness.result.current.invoke();

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    harness.result.current.invoke({ name: 'John' });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    harness.result.current.invoke();

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('Hello');

    harness.result.current.invoke({ name: 'Jane' });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('Hello Jane');
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because params are not expected
      await harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      await harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
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

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - should error because params are not expected
      await harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
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

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getChimeric(queryClient);

    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
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
