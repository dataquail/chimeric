import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('ReactiveQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    const { result } = renderHook(() => reactiveQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    const { result } = renderHook(() => reactiveQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveQuery.use({ name: 'John' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const { result: resultWithoutParams } = renderHook(
      () => reactiveQuery.use(),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.use({ name: 'John' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => reactiveQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } = QueryTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation).toBeDefined();
  });
});
