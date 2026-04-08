import { act } from 'react';
import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { ChimericInfiniteQueryFactory } from './ChimericInfiniteQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

type PageData = { items: string[] };

describe('ChimericInfiniteQueryFactory - Behavior', () => {
  describe('BEHAVIOR: enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const queryClient = new QueryClient();
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-disabled'] as const,
            queryFn: async ({ pageParam }): Promise<PageData> => ({
              items: [`page-${pageParam}`],
            }),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook({ options: { enabled: false } }),
        { wrapper: getTestWrapper(queryClient) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('does not fetch when enabled is false with params', async () => {
      const queryClient = new QueryClient();
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: (args: { category: string }) =>
          infiniteQueryOptions({
            queryKey: ['test-disabled-params', args.category] as const,
            queryFn: async ({ pageParam }): Promise<PageData> => ({
              items: [`${args.category}-page-${pageParam}`],
            }),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      });

      const { result } = renderHook(
        () =>
          chimericInfiniteQuery.useHook(
            { category: 'Books' },
            { options: { enabled: false } },
          ),
        { wrapper: getTestWrapper(queryClient) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('BEHAVIOR: forceRefetch option', () => {
    it('returns cached data when forceRefetch is not set', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-cache'] as const,
            queryFn: async (): Promise<PageData> => ({
              items: [`call-${++callCount}`],
            }),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
            staleTime: Infinity,
          }),
      });

      const result1 = await chimericInfiniteQuery();
      expect(result1.pages[0].items[0]).toBe('call-1');

      const result2 = await chimericInfiniteQuery();
      expect(result2.pages[0].items[0]).toBe('call-1');
    });

    it('bypasses cache when forceRefetch is true', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-force'] as const,
            queryFn: async (): Promise<PageData> => ({
              items: [`call-${++callCount}`],
            }),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
            staleTime: Infinity,
          }),
      });

      const result1 = await chimericInfiniteQuery();
      expect(result1.pages[0].items[0]).toBe('call-1');

      const result2 = await chimericInfiniteQuery({
        options: { forceRefetch: true },
      });
      expect(result2.pages[0].items[0]).toBe('call-2');
    });
  });

  describe('BEHAVIOR: pagination', () => {
    it('accumulates pages via fetchNextPage', async () => {
      const queryClient = new QueryClient();
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-pagination'] as const,
            queryFn: async ({ pageParam }): Promise<PageData> => ({
              items: [`page-${pageParam}-item`],
            }),
            initialPageParam: 0,
            getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
              lastPageParam < 2 ? lastPageParam + 1 : undefined,
          }),
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook(),
        { wrapper: getTestWrapper(queryClient) },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0].items).toEqual(['page-0-item']);
      expect(result.current.hasNextPage).toBe(true);

      await act(async () => {
        await result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages[0].items).toEqual(['page-0-item']);
      expect(result.current.data?.pages[1].items).toEqual(['page-1-item']);
      expect(result.current.hasNextPage).toBe(true);

      await act(async () => {
        await result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(3);
      });

      expect(result.current.data?.pages[2].items).toEqual(['page-2-item']);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-error'] as const,
            queryFn: async (): Promise<PageData> => {
              throw new Error('infinite fetch failed');
            },
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook(),
        { wrapper: getTestWrapper(queryClient) },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('infinite fetch failed');
      expect(result.current.data).toBeUndefined();
    });

    it('throws errors in idiomatic interface', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        queryClient,
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test-error-idiomatic'] as const,
            queryFn: async (): Promise<PageData> => {
              throw new Error('infinite fetch failed');
            },
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      });

      await expect(chimericInfiniteQuery()).rejects.toThrow(
        'infinite fetch failed',
      );
    });
  });
});
