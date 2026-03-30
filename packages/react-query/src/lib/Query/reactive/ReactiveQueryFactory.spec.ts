import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { getSuspenseTestWrapper } from '../../__tests__/getSuspenseTestWrapper';
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

    const { result } = renderHook(() => reactiveQuery.useHook(), {
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

    const { result } = renderHook(
      () => reactiveQuery.useHook({ name: 'John' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

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
      () => reactiveQuery.useHook({ name: 'John' }),
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
      () => reactiveQuery.useHook(),
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
      renderHook(() => reactiveQuery.useHook({ name: 'John' }), {
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
      renderHook(() => reactiveQuery.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.useHook({ wrong: 'param' }), {
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
      renderHook(() => reactiveQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => reactiveQuery.useHook(), {
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
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withParams.getReactive();
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

  // SUSPENSE USAGE
  it('SUSPENSE USAGE: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test-suspense'],
          queryFn,
        }),
    });

    const { result } = renderHook(() => reactiveQuery.useSuspenseHook(), {
      wrapper: getSuspenseTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.data).toBe('test');
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(queryFn).toHaveBeenCalled();
  });

  it('SUSPENSE USAGE: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test-suspense', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    const { result } = renderHook(
      () => reactiveQuery.useSuspenseHook({ name: 'John' }),
      {
        wrapper: getSuspenseTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe('Hello John');
    });

    expect(result.current.isSuccess).toBe(true);
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('SUSPENSE USAGE: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name
            ? ['test-suspense', args.name]
            : ['test-suspense'],
          queryFn: () => queryFn(args),
        }),
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveQuery.useSuspenseHook({ name: 'John' }),
      {
        wrapper: getSuspenseTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.data).toBe('Hello John');
    });

    expect(resultWithParams.current.isSuccess).toBe(true);

    const queryClient2 = new QueryClient();
    const { result: resultWithoutParams } = renderHook(
      () => reactiveQuery.useSuspenseHook(),
      {
        wrapper: getSuspenseTestWrapper(queryClient2),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.data).toBe('Hello');
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
  });

  // SUSPENSE TYPE ERRORS
  it('SUSPENSE TYPE ERRORS: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test-suspense'],
          queryFn,
        }),
    });

    try {
      // @ts-expect-error - Testing type error: no params should not accept params
      renderHook(() => reactiveQuery.useSuspenseHook({ name: 'John' }), {
        wrapper: getSuspenseTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('SUSPENSE TYPE ERRORS: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test-suspense', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error: required params missing
      renderHook(() => reactiveQuery.useSuspenseHook(), {
        wrapper: getSuspenseTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error: wrong params
      renderHook(() => reactiveQuery.useSuspenseHook({ wrong: 'param' }), {
        wrapper: getSuspenseTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('SUSPENSE TYPE ERRORS: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name
            ? ['test-suspense', args.name]
            : ['test-suspense'],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error: wrong params
      renderHook(() => reactiveQuery.useSuspenseHook({ wrong: 'param' }), {
        wrapper: getSuspenseTestWrapper(queryClient),
      });

      // No error - optional params can be omitted
      renderHook(() => reactiveQuery.useSuspenseHook(), {
        wrapper: getSuspenseTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // SUSPENSE ANNOTATIONS
  it('SUSPENSE ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test-suspense'],
          queryFn,
        }),
    });
    expect(testAnnotation.useSuspenseHook).toBeDefined();
  });

  it('SUSPENSE ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test-suspense', args.name],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation.useSuspenseHook).toBeDefined();
  });

  it('SUSPENSE ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name
            ? ['test-suspense', args.name]
            : ['test-suspense'],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation.useSuspenseHook).toBeDefined();
  });
});
