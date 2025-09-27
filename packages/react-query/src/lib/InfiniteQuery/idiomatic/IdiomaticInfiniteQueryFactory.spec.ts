import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { IdiomaticInfiniteQueryFactory } from './IdiomaticInfiniteQueryFactory';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('IdiomaticInfiniteQueryFactory', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should create an idiomatic infinite query', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`page-${pageParam ?? 0}`],
      nextCursor: pageParam < 2 ? pageParam + 1 : null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-infinite'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    );

    const result = await idiomaticInfiniteQuery();

    expect(result).toBeDefined();
    expect(result.pages).toBeDefined();
    expect(result.pageParams).toBeDefined();
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].items[0]).toBe('page-0');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle parameters', async () => {
    const mockQueryFn = vi.fn();

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      (params: { category: string }) =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-params', params.category],
          queryFn: async (args) => {
            const {
              pageParam,
              queryKey: [_, params],
            } = args;
            mockQueryFn();
            return {
              items: [`${params}-page-${pageParam ?? 0}`],
              nextCursor: null,
            };
          },
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    );

    const result = await idiomaticInfiniteQuery({ category: 'books' });

    expect(result.pages[0].items[0]).toBe('books-page-0');
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });

  it('should handle forceRefetch option', async () => {
    let callCount = 0;
    const mockQueryFn = vi.fn(async () => ({
      items: [`call-${++callCount}`],
      nextCursor: null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['force-refetch-test'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
          staleTime: Infinity,
        }),
    );

    // First call - should fetch
    const result1 = await idiomaticInfiniteQuery();
    expect(result1.pages[0].items[0]).toBe('call-1');

    // Second call without forceRefetch - should use cache
    const result2 = await idiomaticInfiniteQuery();
    expect(result2.pages[0].items[0]).toBe('call-1');

    // Third call with forceRefetch - should fetch again
    const result3 = await idiomaticInfiniteQuery({
      options: { forceRefetch: true },
    });
    expect(result3.pages[0].items[0]).toBe('call-2');

    expect(mockQueryFn).toHaveBeenCalledTimes(2);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch infinite data');
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['error-test'],
          queryFn: async () => {
            throw mockError;
          },
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    await expect(idiomaticInfiniteQuery()).rejects.toThrow(
      'Failed to fetch infinite data',
    );
  });
});
