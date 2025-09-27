import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { ReactiveInfiniteQueryFactory } from './ReactiveInfiniteQueryFactory';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

describe('ReactiveInfiniteQueryFactory', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should create a reactive infinite query hook', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`page-${pageParam ?? 0}`],
      nextCursor: pageParam < 2 ? pageParam + 1 : null,
    }));

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['reactive-infinite'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    );

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.pages).toBeDefined();
    expect(result.current.data?.pageParams).toBeDefined();
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items[0]).toBe('page-0');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle parameters', async () => {
    const mockQueryFn = vi.fn();

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(
      (params: { category: string }) =>
        infiniteQueryOptions({
          queryKey: ['reactive-params', params.category],
          queryFn: async (args) => {
            mockQueryFn(args);
            const {
              pageParam,
              queryKey: [, params],
            } = args;
            return {
              items: [`${params}-page-${pageParam ?? 0}`],
              nextCursor: null,
            };
          },
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    );

    const { result } = renderHook(
      () => reactiveInfiniteQuery.use({ category: 'books' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0].items[0]).toBe('books-page-0');
    expect(mockQueryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['reactive-params', 'books'],
      }),
    );
  });

  it('should support pagination methods', async () => {
    const mockQueryFn = vi.fn();

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['pagination-test'],
        queryFn: async (args) => {
          const { pageParam } = args;
          mockQueryFn(args);
          return {
            items: [`page-${pageParam ?? 0}`],
            nextCursor: pageParam < 2 ? (pageParam ?? 0) + 1 : null,
          };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    );

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.data?.pages[1].items[0]).toBe('page-1');
  });

  it('should handle loading states', async () => {
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['loading-test'],
        queryFn: () =>
          new Promise<{ items: string[]; nextCursor: null }>((resolve) =>
            setTimeout(
              () => resolve({ items: ['loaded'], nextCursor: null }),
              100,
            ),
          ),
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.data?.pages[0].items[0]).toBe('loaded');
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch infinite data');
    const mockQueryFn = vi.fn(async () => {
      throw mockError;
    });

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['error-test'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should expose native react-query result', async () => {
    const mockQueryFn = vi.fn(async () => ({
      items: ['test'],
      nextCursor: null,
    }));

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['native-test'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const { result } = renderHook(() => reactiveInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.native).toBeDefined();
    expect(result.current.native).toHaveProperty('dataUpdatedAt');
    expect(result.current.native).toHaveProperty('status');
  });
});
