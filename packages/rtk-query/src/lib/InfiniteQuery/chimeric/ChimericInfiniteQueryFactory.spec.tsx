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

const createTestApi = () =>
  createApi({
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
          const items = ALL_ITEMS.slice(start, start + 3);
          return { data: items };
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
    }),
  });

const createTestStore = (api: ReturnType<typeof createTestApi>) =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('ChimericInfiniteQueryFactory', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    const result = await chimericInfiniteQuery();

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toEqual([
      { id: 0, name: 'Item 0' },
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
    expect(result.pageParams).toEqual([0]);
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    const result = await chimericInfiniteQuery({ category: 'Books' });

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toEqual([
      { id: 0, name: 'Books: Item 0' },
      { id: 1, name: 'Books: Item 1' },
    ]);
  });

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    const { result } = renderHook(() => chimericInfiniteQuery.useHook(), {
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

  it('USAGE: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    const { result } = renderHook(
      () => chimericInfiniteQuery.useHook({ category: 'Books' }),
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

  // TYPE ERRORS
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery({ category: 'wrong' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
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

  // PREFETCH USAGE: IDIOMATIC
  it('PREFETCH USAGE: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    await chimericInfiniteQuery.prefetch();
  });

  it('PREFETCH USAGE: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    await chimericInfiniteQuery.prefetch({ category: 'Books' });
  });

  // PREFETCH TYPE ERRORS: IDIOMATIC
  it('PREFETCH TYPE ERRORS: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery.prefetch({ category: 'wrong' });
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery.prefetch();

      // @ts-expect-error - Testing type error
      await chimericInfiniteQuery.prefetch({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  // PREFETCH USAGE: REACTIVE
  it('PREFETCH USAGE: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    renderHook(() => chimericInfiniteQuery.usePrefetchHook(), {
      wrapper: getTestWrapper(store),
    });
  });

  it('PREFETCH USAGE: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    renderHook(
      () => chimericInfiniteQuery.usePrefetchHook({ category: 'Books' }),
      {
        wrapper: getTestWrapper(store),
      },
    );
  });

  // PREFETCH TYPE ERRORS: REACTIVE
  it('PREFETCH TYPE ERRORS: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(
        () => chimericInfiniteQuery.usePrefetchHook({ category: 'wrong' }),
        {
          wrapper: getTestWrapper(store),
        },
      );
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericInfiniteQuery = ChimericInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => chimericInfiniteQuery.usePrefetchHook(), {
        wrapper: getTestWrapper(store),
      });

      renderHook(
        () =>
          // @ts-expect-error - Testing type error
          chimericInfiniteQuery.usePrefetchHook({ wrong: 'param' }),
        {
          wrapper: getTestWrapper(store),
        },
      );
    } catch {
      // Expected errors
    }
  });
});
