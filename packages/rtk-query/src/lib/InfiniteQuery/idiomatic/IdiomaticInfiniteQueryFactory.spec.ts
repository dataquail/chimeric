import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { IdiomaticInfiniteQueryFactory } from './IdiomaticInfiniteQueryFactory';

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

describe('IdiomaticInfiniteQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    const result = await idiomaticInfiniteQuery();

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toEqual([
      { id: 0, name: 'Item 0' },
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
    expect(result.pageParams).toEqual([0]);
  });

  it('USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    const result = await idiomaticInfiniteQuery({ category: 'Books' });

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0]).toEqual([
      { id: 0, name: 'Books: Item 0' },
      { id: 1, name: 'Books: Item 1' },
    ]);
  });

  it('USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    const resultWithParams = await idiomaticInfiniteQuery({
      category: 'Books',
    });
    expect(resultWithParams.pages[0]).toEqual([
      { id: 0, name: 'Books: Item 0' },
      { id: 1, name: 'Books: Item 1' },
    ]);

    const resultWithoutParams = await idiomaticInfiniteQuery();
    expect(resultWithoutParams.pages[0]).toEqual([
      { id: 0, name: 'Item 0' },
      { id: 1, name: 'Item 1' },
    ]);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ category: 'wrong' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery();

      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery({ wrong: 'param' });

      await idiomaticInfiniteQuery();
    } catch {
      // Expected error
    }
  });

  // PREFETCH USAGE
  it('PREFETCH USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    await idiomaticInfiniteQuery.prefetch();
  });

  it('PREFETCH USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    await idiomaticInfiniteQuery.prefetch({ category: 'Books' });
  });

  it('PREFETCH USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsOptional,
      endpointName: 'getItemsOptional',
      api,
    });

    await idiomaticInfiniteQuery.prefetch({ category: 'Books' });
    await idiomaticInfiniteQuery.prefetch();
  });

  // PREFETCH TYPE ERRORS
  it('PREFETCH TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItems,
      endpointName: 'getItems',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery.prefetch({ category: 'wrong' });
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory({
      store,
      endpoint: api.endpoints.getItemsByCategory,
      endpointName: 'getItemsByCategory',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery.prefetch();

      // @ts-expect-error - Testing type error
      await idiomaticInfiniteQuery.prefetch({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });
});
