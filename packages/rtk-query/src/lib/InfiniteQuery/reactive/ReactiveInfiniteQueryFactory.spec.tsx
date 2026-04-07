import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveInfiniteQueryFactory } from './ReactiveInfiniteQueryFactory';

type PageItem = { id: number; name: string };

const ALL_ITEMS: PageItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

const createTestApi = () =>
  createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
      getItems: build.infiniteQuery<PageItem[], void, number>({
        infiniteQueryOptions: {
          initialPageParam: 0,
          getNextPageParam: (
            _lastPage: PageItem[],
            allPages: PageItem[][],
            lastPageParam: number,
          ) => (lastPageParam + 1 < 3 ? lastPageParam + 1 : undefined),
          getPreviousPageParam: (
            _firstPage: PageItem[],
            _allPages: PageItem[][],
            firstPageParam: number,
          ) => (firstPageParam > 0 ? firstPageParam - 1 : undefined),
        },
        queryFn: async ({ pageParam }) => {
          const start = pageParam * 3;
          return { data: ALL_ITEMS.slice(start, start + 3) };
        },
      }),
      getItemsByCategory: build.infiniteQuery<
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
          const items = ALL_ITEMS.slice(pageParam * 2, pageParam * 2 + 2).map(
            (item) => ({
              ...item,
              name: `${queryArg.category}: ${item.name}`,
            }),
          );
          return { data: items };
        },
      }),
      getItemsOptional: build.infiniteQuery<
        PageItem[],
        { category: string } | undefined,
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
          const items = ALL_ITEMS.slice(pageParam * 2, pageParam * 2 + 2).map(
            (item) => ({
              ...item,
              name: queryArg
                ? `${queryArg.category}: ${item.name}`
                : item.name,
            }),
          );
          return { data: items };
        },
      }),
    }),
  });

const createTestStore = (api: ReturnType<typeof createTestApi>) =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('ReactiveInfiniteQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    const { result } = renderHook(() => reactiveInfiniteQuery.useHook(), {
      wrapper: getTestWrapper(store),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0]).toEqual([
      { id: 0, name: 'Item 0' },
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    const { result } = renderHook(
      () => reactiveInfiniteQuery.useHook({ category: 'Books' }),
      {
        wrapper: getTestWrapper(store),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data?.pages[0]).toEqual([
      { id: 0, name: 'Books: Item 0' },
      { id: 1, name: 'Books: Item 1' },
    ]);
  });

  it('USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveInfiniteQuery.useHook({ category: 'Books' }),
      {
        wrapper: getTestWrapper(store),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data?.pages[0]).toEqual([
      { id: 0, name: 'Books: Item 0' },
      { id: 1, name: 'Books: Item 1' },
    ]);

    const api2 = createTestApi();
    const store2 = createTestStore(api2);
    const reactiveInfiniteQuery2 = ReactiveInfiniteQueryFactory({
      endpoint: api2.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api: api2,
    });

    const { result: resultWithoutParams } = renderHook(
      () => reactiveInfiniteQuery2.useHook(),
      {
        wrapper: getTestWrapper(store2),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data?.pages[0]).toEqual([
      { id: 0, name: 'Item 0' },
      { id: 1, name: 'Item 1' },
    ]);
  });

  it('USAGE: fetchNextPage', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    const { result } = renderHook(() => reactiveInfiniteQuery.useHook(), {
      wrapper: getTestWrapper(store),
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

    expect(result.current.data?.pages[1]).toEqual([
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ]);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.useHook({ category: 'wrong' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.useHook(), {
        wrapper: getTestWrapper(store),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });

      renderHook(() => reactiveInfiniteQuery.useHook(), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected error
    }
  });

  // PREFETCH USAGE
  it('PREFETCH USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    renderHook(() => reactiveInfiniteQuery.usePrefetchHook(), {
      wrapper: getTestWrapper(store),
    });
  });

  it('PREFETCH USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    renderHook(
      () => reactiveInfiniteQuery.usePrefetchHook({ category: 'Books' }),
      {
        wrapper: getTestWrapper(store),
      },
    );
  });

  it('PREFETCH USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    renderHook(
      () => reactiveInfiniteQuery.usePrefetchHook({ category: 'Books' }),
      {
        wrapper: getTestWrapper(store),
      },
    );

    const store2 = createTestStore(createTestApi());
    renderHook(() => reactiveInfiniteQuery.usePrefetchHook(), {
      wrapper: getTestWrapper(store2),
    });
  });

  // PREFETCH TYPE ERRORS
  it('PREFETCH TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      renderHook(
        // @ts-expect-error - Testing type error
        () => reactiveInfiniteQuery.usePrefetchHook({ category: 'wrong' }),
        {
          wrapper: getTestWrapper(store),
        },
      );
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory({
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveInfiniteQuery.usePrefetchHook(), {
        wrapper: getTestWrapper(store),
      });

      renderHook(
        () =>
          // @ts-expect-error - Testing type error
          reactiveInfiniteQuery.usePrefetchHook({ wrong: 'param' }),
        {
          wrapper: getTestWrapper(store),
        },
      );
    } catch {
      // Expected errors
    }
  });
});
