import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { IdiomaticInfiniteQueryFactory } from './IdiomaticInfiniteQueryFactory';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('IdiomaticInfiniteQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn: () => queryFn(),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    const result = await idiomaticInfiniteQuery();

    expect(result).toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    const result = await idiomaticInfiniteQuery({ search: 'test' });

    expect(result).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });
  });

  it('USAGE: with optional params', async () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    const resultWithParams = await idiomaticInfiniteQuery({ search: 'test' });

    expect(resultWithParams).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });

    const resultWithoutParams = await idiomaticInfiniteQuery();

    expect(resultWithoutParams).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn: () => queryFn(),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ search: 'test' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery();

      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ wrong: 'param' });

      await idiomaticInfiniteQuery();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn: () => queryFn(),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticInfiniteQueryFactory({
      queryClient: new QueryClient(),
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });
});
