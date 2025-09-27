import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { ReactiveInfiniteQueryFactory } from '../reactive/ReactiveInfiniteQueryFactory';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

describe('fuseChimericInfiniteQuery', () => {
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

  it('should create a chimeric infinite query combining idiomatic and reactive', () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`page-${pageParam ?? 0}`],
      nextCursor: null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['chimeric-test'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['chimeric-test'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    expect(chimericInfiniteQuery).toBeDefined();
    expect(chimericInfiniteQuery).toHaveProperty('use');
    expect(typeof chimericInfiniteQuery).toBe('function');
  });

  it('should invoke idiomatic query when called directly', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`idiomatic-page-${pageParam ?? 0}`],
      nextCursor: null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-test'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['reactive-test'],
        queryFn: vi.fn(),
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    const result = await chimericInfiniteQuery();
    expect(result).toBeDefined();
    expect(result.pages).toBeDefined();
    expect(result.pages[0].items[0]).toBe('idiomatic-page-0');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke reactive query when using .use()', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`reactive-page-${pageParam ?? 0}`],
      nextCursor: null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-hook-test'],
          queryFn: vi.fn(),
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['reactive-hook-test'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    const { result } = renderHook(() => chimericInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.pages[0].items[0]).toBe('reactive-page-0');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle parameters for both interfaces', async () => {
    const mockIdiomaticFn = vi.fn(async ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [string, { search: string }];
      return {
        items: [`idiomatic-${params.search}-page-${pageParam ?? 0}`],
        nextCursor: null,
      };
    });

    const mockReactiveFn = vi.fn(async ({ pageParam, queryKey }) => {
      const [, params] = queryKey as [string, { search: string }];
      return {
        items: [`reactive-${params.search}-page-${pageParam ?? 0}`],
        nextCursor: null,
      };
    });

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      (params: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-params', params],
          queryFn: mockIdiomaticFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(
      (params: { search: string }) =>
        infiniteQueryOptions({
          queryKey: ['reactive-params', params],
          queryFn: mockReactiveFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    const idiomaticResult = await chimericInfiniteQuery({ search: 'test' });
    expect(idiomaticResult.pages[0].items[0]).toBe('idiomatic-test-page-0');

    const { result } = renderHook(
      () => chimericInfiniteQuery.use({ search: 'test' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0].items[0]).toBe('reactive-test-page-0');
  });

  it('should support pagination methods in reactive mode', async () => {
    const mockQueryFn = vi.fn(async ({ pageParam }) => ({
      items: [`page-${pageParam ?? 0}`],
      nextCursor: pageParam < 2 ? (pageParam ?? 0) + 1 : null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-pagination'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['reactive-pagination'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    const { result } = renderHook(() => chimericInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);

    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.data?.pages[1].items[0]).toBe('page-1');
  });

  it('should handle errors properly', async () => {
    const mockError = new Error('Test error');

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['idiomatic-error'],
          queryFn: async () => {
            throw mockError;
          },
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['reactive-error'],
        queryFn: async () => {
          throw mockError;
        },
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    await expect(chimericInfiniteQuery()).rejects.toThrow('Test error');

    const { result } = renderHook(() => chimericInfiniteQuery.use(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
