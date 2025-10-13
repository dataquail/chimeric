import { act } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveMutationFactory } from './ReactiveMutationFactory';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('ReactiveMutationFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(reactiveMutation.use, {
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

  it('USAGE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(() => reactiveMutation.use(), {
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

  it('USAGE: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(() => reactiveMutation.use(), {
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

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(() => reactiveMutation.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ name: 'John' }));
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(() => reactiveMutation.use(), {
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

  it('TYPE ERRORS: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveMutation = ReactiveMutationFactory({ mutationFn });
    const { result } = renderHook(() => reactiveMutation.use(), {
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

  // ANOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveMutationFactory({
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveMutationFactory({
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveMutationFactory({
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
