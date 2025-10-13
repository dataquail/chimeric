import { act } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericMutationFactory } from './ChimericMutationFactory';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('ChimericMutationFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const { result } = renderHook(chimericMutation.use, {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const { result } = renderHook(() => chimericMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const { result } = renderHook(() => chimericMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined);

    await act(async () => result.current.invoke({ name: 'Jane' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result = await chimericMutation({
      nativeOptions: { onSuccess: onSuccessSpy },
    });

    expect(result).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
    expect(onSuccessSpy).toHaveBeenCalledWith('test', undefined, undefined);
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result = await chimericMutation(
      { name: 'John' },
      { nativeOptions: { onSuccess: onSuccessSpy } },
    );

    expect(result).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' });
    expect(onSuccessSpy).toHaveBeenCalledWith(
      'Hello John',
      { name: 'John' },
      undefined,
    );
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result1 = await chimericMutation(undefined, {
      nativeOptions: { onSuccess: onSuccessSpy },
    });

    expect(result1).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined);
    expect(onSuccessSpy).toHaveBeenCalledWith('Hello', undefined, undefined);

    const result2 = await chimericMutation(
      { name: 'Jane' },
      {
        nativeOptions: { onSuccess: onSuccessSpy },
      },
    );

    expect(result2).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(onSuccessSpy).toHaveBeenCalledWith(
      'Hello Jane',
      { name: 'Jane' },
      undefined,
    );
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });
    const { result } = renderHook(() => chimericMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ name: 'John' }));
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
    const { result } = renderHook(() => chimericMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke());

      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ wrong: 'param' }));
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
    const { result } = renderHook(() => chimericMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ wrong: 'param' }));

      await act(async () => result.current.invoke());
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
