import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { ChimericInfiniteQueryFactory } from '../chimeric/ChimericInfiniteQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('ChimericInfiniteQueryFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
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

    const { result } = renderHook(() => chimericInfiniteQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
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

    const { result } = renderHook(
      () => chimericInfiniteQuery.use({ search: 'test' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
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

    const { result: resultWithParams } = renderHook(
      () => chimericInfiniteQuery.use({ search: 'test' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });

    const { result: resultWithoutParams } = renderHook(
      () => chimericInfiniteQuery.use(),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

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

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
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
      renderHook(() => chimericInfiniteQuery.use({ search: 'test' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
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
      renderHook(() => chimericInfiniteQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => chimericInfiniteQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
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
      renderHook(() => chimericInfiniteQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => chimericInfiniteQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
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
