import { QueryClient } from '@tanstack/svelte-query';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { ChimericMutationFactory } from './ChimericMutationFactory';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import ChimericMutationTestWrapper from '../../__tests__/ChimericMutationTestWrapper.svelte';

describe('ChimericMutationFactory', () => {
  const expectedContext = expect.objectContaining({
    client: expect.any(QueryClient),
  });

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { getByTestId } = render(ChimericMutationTestWrapper, {
      props: { chimericMutation },
    });

    expect(getByTestId('isIdle').textContent).toBe('true');
    expect(getByTestId('isSuccess').textContent).toBe('false');

    await fireEvent.click(getByTestId('invoke'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { getByTestId } = render(ChimericMutationTestWrapper, {
      props: { chimericMutation, invokeParams: { name: 'John' } },
    });

    expect(getByTestId('isIdle').textContent).toBe('true');
    expect(getByTestId('isSuccess').textContent).toBe('false');

    await fireEvent.click(getByTestId('invoke'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params - no params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { getByTestId } = render(ChimericMutationTestWrapper, {
      props: { chimericMutation },
    });

    expect(getByTestId('isIdle').textContent).toBe('true');

    await fireEvent.click(getByTestId('invoke'));

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const result = await chimericMutation();

    expect(result).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const result = await chimericMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' }, expectedContext);
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const result1 = await chimericMutation(undefined);

    expect(result1).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined, expectedContext);

    const result2 = await chimericMutation({ name: 'Jane' });

    expect(result2).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' }, expectedContext);
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      const state = chimericMutation.useHook();
      // @ts-expect-error - Testing type error
      await state.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      const state = chimericMutation.useHook();
      // @ts-expect-error - Testing type error
      await state.invoke();
      // @ts-expect-error - Testing type error
      await state.invoke({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      const state = chimericMutation.useHook();
      // @ts-expect-error - Testing type error
      await state.invoke({ wrong: 'param' });
      await state.invoke();
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation();
      // @ts-expect-error - Testing type error
      await chimericMutation({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation({ wrong: 'param' });

      await chimericMutation();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
