import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { ChimericInfiniteQueryFactory } from './ChimericInfiniteQueryFactory.server';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('ChimericInfiniteQueryFactoryServer', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    const result = await chimericInfiniteQuery();

    expect(result).toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    const result = await chimericInfiniteQuery({ search: 'test' });

    expect(result).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    const resultWithParams = await chimericInfiniteQuery({ search: 'test' });

    expect(resultWithParams).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });

    const resultWithoutParams = await chimericInfiniteQuery();

    expect(resultWithoutParams).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // USAGE: PREFETCH
  it('USAGE: PREFETCH: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test-prefetch'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    await expect(chimericInfiniteQuery.prefetch()).resolves.toBeUndefined();
  });

  it('USAGE: PREFETCH: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test-prefetch', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    await expect(
      chimericInfiniteQuery.prefetch({ search: 'test' }),
    ).resolves.toBeUndefined();
  });

  it('USAGE: PREFETCH: with optional params', async () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test-prefetch', args.search] : ['test-prefetch'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    await expect(
      chimericInfiniteQuery.prefetch({ search: 'test' }),
    ).resolves.toBeUndefined();
    await expect(chimericInfiniteQuery.prefetch()).resolves.toBeUndefined();
  });

  // SERVER ERRORS: useHook
  it('SERVER ERRORS: useHook throws', () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    expect(() => chimericInfiniteQuery.useHook()).toThrow(
      "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // SERVER ERRORS: usePrefetchHook
  it('SERVER ERRORS: usePrefetchHook throws', () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    expect(() => chimericInfiniteQuery.usePrefetchHook()).toThrow(
      "@chimeric/react-query: usePrefetchHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery({ search: 'test' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery();

      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery({ wrong: 'param' });

      await chimericInfiniteQuery();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });
});
