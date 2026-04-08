import { act } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericInfiniteQueryFactory } from './ChimericInfiniteQueryFactory';

type PageItem = { id: number; name: string };

const ALL_ITEMS: PageItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

describe('ChimericInfiniteQueryFactory - Behavior', () => {
  describe('BEHAVIOR: enabled option', () => {
    it('does not fetch when enabled is false (void params)', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<PageItem[], void, number>({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: (
                _lastPage: PageItem[],
                _allPages: PageItem[][],
                lastPageParam: number,
              ) => (lastPageParam + 1 < 3 ? lastPageParam + 1 : undefined),
            },
            queryFn: async ({ pageParam }) => {
              const start = pageParam * 3;
              return { data: ALL_ITEMS.slice(start, start + 3) };
            },
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook({ options: { enabled: false } }),
        { wrapper: getTestWrapper(store) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('does not fetch when enabled is false (with params)', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<
            PageItem[],
            { category: string },
            number
          >({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: (
                _lastPage: PageItem[],
                _allPages: PageItem[][],
                lastPageParam: number,
              ) => (lastPageParam + 1 < 2 ? lastPageParam + 1 : undefined),
            },
            queryFn: async ({ queryArg, pageParam }) => {
              const items = ALL_ITEMS.slice(
                pageParam * 2,
                pageParam * 2 + 2,
              ).map((item) => ({
                ...item,
                name: `${queryArg.category}: ${item.name}`,
              }));
              return { data: items };
            },
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const { result } = renderHook(
        () =>
          chimericInfiniteQuery.useHook(
            { category: 'Books' },
            { options: { enabled: false } },
          ),
        { wrapper: getTestWrapper(store) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('BEHAVIOR: forceRefetch option', () => {
    it('returns cached data when forceRefetch is not set', async () => {
      let callCount = 0;
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<
            PageItem[],
            { category: string },
            number
          >({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: () => undefined,
            },
            queryFn: async ({ queryArg }) => ({
              data: [
                {
                  id: ++callCount,
                  name: `${queryArg.category}-call-${callCount}`,
                },
              ],
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const result1 = await chimericInfiniteQuery({ category: 'Books' });
      expect(result1.pages[0][0].name).toBe('Books-call-1');

      const result2 = await chimericInfiniteQuery({ category: 'Books' });
      expect(result2.pages[0][0].name).toBe('Books-call-1');
    });

    it('bypasses cache when forceRefetch is true', async () => {
      let callCount = 0;
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<
            PageItem[],
            { category: string },
            number
          >({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: () => undefined,
            },
            queryFn: async ({ queryArg }) => ({
              data: [
                {
                  id: ++callCount,
                  name: `${queryArg.category}-call-${callCount}`,
                },
              ],
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const result1 = await chimericInfiniteQuery({ category: 'Books' });
      expect(result1.pages[0][0].name).toBe('Books-call-1');

      const result2 = await chimericInfiniteQuery(
        { category: 'Books' },
        { options: { forceRefetch: true } },
      );
      expect(result2.pages[0][0].name).toBe('Books-call-2');
    });
  });

  describe('BEHAVIOR: pagination', () => {
    it('accumulates pages via fetchNextPage', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<PageItem[], void, number>({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: (
                _lastPage: PageItem[],
                _allPages: PageItem[][],
                lastPageParam: number,
              ) => (lastPageParam + 1 < 3 ? lastPageParam + 1 : undefined),
            },
            queryFn: async ({ pageParam }) => {
              const start = pageParam * 3;
              return { data: ALL_ITEMS.slice(start, start + 3) };
            },
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook(),
        { wrapper: getTestWrapper(store) },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual([
        { id: 0, name: 'Item 0' },
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
      expect(result.current.hasNextPage).toBe(true);

      await act(async () => {
        await result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages[1]).toEqual([
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
      ]);
      expect(result.current.hasNextPage).toBe(true);

      await act(async () => {
        await result.current.fetchNextPage();
      });

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(3);
      });

      expect(result.current.data?.pages[2]).toEqual([
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
      ]);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<PageItem[], void, number>({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: () => undefined,
            },
            queryFn: async () => ({
              error: { status: 500, data: 'infinite fetch failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      const { result } = renderHook(
        () => chimericInfiniteQuery.useHook(),
        { wrapper: getTestWrapper(store) },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });

    it('throws errors in idiomatic interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getItems: build.infiniteQuery<PageItem[], void, number>({
            infiniteQueryOptions: {
              initialPageParam: 0,
              getNextPageParam: () => undefined,
            },
            queryFn: async () => ({
              error: { status: 500, data: 'infinite fetch failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
        store,
        endpoint: api.endpoints.getItems,
        endpointName: 'getItems',
        api,
      });

      await expect(chimericInfiniteQuery()).rejects.toThrow();
    });
  });
});
