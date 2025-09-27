import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { ChimericInfiniteQueryFactory } from './ChimericInfiniteQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ChimericInfiniteQueryFactory', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should create a chimeric infinite query with reactive interface', async () => {
    const mockPages = [
      { items: [1, 2, 3], nextCursor: 1 },
      { items: [4, 5, 6], nextCursor: 2 },
    ];

    const chimericQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['infinite-test'],
          queryFn: async ({ pageParam }) => {
            const page = pageParam ?? 0;
            return mockPages[page] || { items: [], nextCursor: null };
          },
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    });

    const { result } = renderHook(() => chimericQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items).toEqual([1, 2, 3]);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.fetchNextPage).toBeDefined();
  });

  it('should create a chimeric infinite query with idiomatic interface', async () => {
    const chimericQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['infinite-idiomatic'],
          queryFn: async ({ pageParam }) => ({
            items: [`item-${pageParam ?? 0}`],
            nextCursor: null,
          }),
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    const result = await chimericQuery();

    expect(result).toBeDefined();
    expect(result.pages).toBeDefined();
    expect(result.pageParams).toBeDefined();
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].items[0]).toBe('item-0');
  });

  it('should handle pagination correctly', async () => {
    const mockPages = [
      { items: ['page1'], nextCursor: 1 },
      { items: ['page2'], nextCursor: 2 },
      { items: ['page3'], nextCursor: null },
    ];

    const chimericQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['infinite-pagination'],
          queryFn: async ({ pageParam }) => {
            const page = pageParam ?? 0;
            return mockPages[page] || { items: [], nextCursor: null };
          },
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    });

    const { result } = renderHook(() => chimericQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items[0]).toBe('page1');

    // Fetch next page
    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.data?.pages[1].items[0]).toBe('page2');
  });

  it('should handle query parameters', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [string, { category: string }];
      return {
        items: [`${params.category}-page${pageParam ?? 0}`],
        nextCursor: null,
      };
    });

    const chimericQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: (params: { category: string }) =>
        infiniteQueryOptions({
          queryKey: ['infinite-params', params],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    });

    const { result } = renderHook(
      () => chimericQuery.use({ category: 'electronics' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0].items[0]).toBe('electronics-page0');
    expect(mockQueryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['infinite-params', { category: 'electronics' }],
        pageParam: 0,
      }),
    );
  });

  it('should handle error states', async () => {
    const mockError = new Error('Failed to fetch infinite data');
    const chimericQuery = ChimericInfiniteQueryFactory({
      queryClient,
      getInfiniteQueryOptions: () =>
        infiniteQueryOptions({
          queryKey: ['infinite-error'],
          queryFn: async () => {
            throw mockError;
          },
          initialPageParam: 0,
          getNextPageParam: () => undefined,
        }),
    });

    const { result } = renderHook(() => chimericQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
  });
});
