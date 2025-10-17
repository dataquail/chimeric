import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveInfiniteQueryFactory } from './ReactiveInfiniteQueryFactory';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('ReactiveInfiniteQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items[0].name).toBe('Item 1');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    const { result } = renderHook(
      () => reactiveInfiniteQuery.use({ search: 'test' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.pages[0].items[0].name).toBe(
      'Filtered by test',
    );
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });
  });

  it('USAGE: with optional params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveInfiniteQuery.use({ search: 'test' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data?.pages[0].items[0].name).toBe(
      'Filtered by test',
    );
    expect(queryFn).toHaveBeenCalledWith({ search: 'test' });

    const { result: resultWithoutParams } = renderHook(
      () => reactiveInfiniteQuery.use(),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data?.pages[0].items[0].name).toBe(
      'All items',
    );
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: infinite query specific methods - fetchNextPage', async () => {
    let pageParam = 0;
    const queryFn = vi.fn(() => {
      const currentPage = pageParam;
      pageParam++;
      return Promise.resolve({
        items: [{ id: currentPage, name: `Page ${currentPage}` }],
      });
    });
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test-pagination'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage, allPages) =>
            allPages.length < 3 ? allPages.length : undefined,
        }),
    });

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.data?.pages[1].items[0].name).toBe('Page 1');
  });

  it('USAGE: infinite query specific methods - fetchPreviousPage', async () => {
    let pageParam = 0;
    const queryFn = vi.fn(() => {
      const currentPage = pageParam;
      pageParam--;
      return Promise.resolve({
        items: [{ id: currentPage, name: `Page ${currentPage}` }],
      });
    });
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test-previous-pagination'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: () => undefined,
          getPreviousPageParam: (firstPage, allPages) =>
            allPages.length < 3 ? -allPages.length : undefined,
        }),
    });

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasPreviousPage).toBe(true);

    await result.current.fetchPreviousPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.use({ search: 'test' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { queryFn } = InfiniteQueryTestFixtures.withOptionalParams.getReactive();
    const queryClient = new QueryClient();
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => reactiveInfiniteQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['test', args.search],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveInfiniteQueryFactory({
      getInfiniteQueryOptions: (args?: { search: string }) =>
        infiniteQueryOptions({
          queryKey: args?.search ? ['test', args.search] : ['test'],
          queryFn: () => queryFn(args),
          initialPageParam: 0,
          getNextPageParam: (lastPage) =>
            lastPage.items.length > 0 ? 1 : undefined,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });
});
