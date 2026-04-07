import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';

const createTestApi = () =>
  createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
      getTest: build.query<string, void>({
        queryFn: async () => ({ data: 'test' }),
      }),
      getTestWithParams: build.query<string, { name: string }>({
        queryFn: async (args) => ({ data: `Hello ${args.name}` }),
      }),
      getTestWithOptionalParams: build.query<
        string,
        { name: string } | undefined
      >({
        queryFn: async (args) => ({
          data: args ? `Hello ${args.name}` : 'Hello',
        }),
      }),
    }),
  });

const createTestStore = (api: ReturnType<typeof createTestApi>) =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('ReactiveQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    const { result } = renderHook(() => reactiveQuery.useHook(), {
      wrapper: getTestWrapper(store),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('test');
  });

  it('USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    const { result } = renderHook(
      () => reactiveQuery.useHook({ name: 'John' }),
      {
        wrapper: getTestWrapper(store),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('Hello John');
  });

  it('USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveQuery.useHook({ name: 'John' }),
      {
        wrapper: getTestWrapper(store),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data).toBe('Hello John');

    const api2 = createTestApi();
    const store2 = createTestStore(api2);
    const reactiveQuery2 = ReactiveQueryFactory({
      endpoint: api2.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api: api2,
    });

    const { result: resultWithoutParams } = renderHook(
      () => reactiveQuery2.useHook(),
      {
        wrapper: getTestWrapper(store2),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data).toBe('Hello');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.useHook({ name: 'John' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.useHook(), {
        wrapper: getTestWrapper(store),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });

      renderHook(() => reactiveQuery.useHook(), {
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
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    renderHook(() => reactiveQuery.usePrefetchHook(), {
      wrapper: getTestWrapper(store),
    });
  });

  it('PREFETCH USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    renderHook(() => reactiveQuery.usePrefetchHook({ name: 'John' }), {
      wrapper: getTestWrapper(store),
    });
  });

  it('PREFETCH USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    renderHook(() => reactiveQuery.usePrefetchHook({ name: 'John' }), {
      wrapper: getTestWrapper(store),
    });

    const store2 = createTestStore(createTestApi());
    renderHook(() => reactiveQuery.usePrefetchHook(), {
      wrapper: getTestWrapper(store2),
    });
  });

  // PREFETCH TYPE ERRORS
  it('PREFETCH TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.usePrefetchHook({ name: 'John' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const reactiveQuery = ReactiveQueryFactory({
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.usePrefetchHook(), {
        wrapper: getTestWrapper(store),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveQuery.usePrefetchHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected errors
    }
  });
});
