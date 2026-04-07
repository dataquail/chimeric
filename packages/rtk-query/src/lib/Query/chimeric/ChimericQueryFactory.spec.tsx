import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericQueryFactory } from './ChimericQueryFactory';

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

describe('ChimericQueryFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    const { result } = renderHook(() => chimericQuery.useHook(), {
      wrapper: getTestWrapper(store),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('test');
  });

  it('USAGE: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    const { result } = renderHook(
      () => chimericQuery.useHook({ name: 'John' }),
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

  it('USAGE: REACTIVE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    const { result: resultWithParams } = renderHook(
      () => chimericQuery.useHook({ name: 'John' }),
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
    const chimericQuery2 = ChimericQueryFactory({
      store: store2,
      endpoint: api2.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api: api2,
    });

    const { result: resultWithoutParams } = renderHook(
      () => chimericQuery2.useHook(),
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

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    const result = await chimericQuery();

    expect(result).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    const resultWithParams = await chimericQuery({ name: 'John' });
    expect(resultWithParams).toBe('Hello John');

    const resultWithoutParams = await chimericQuery();
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => chimericQuery.useHook({ name: 'John' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => chimericQuery.useHook(), {
        wrapper: getTestWrapper(store),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => chimericQuery.useHook({ wrong: 'param' }), {
        wrapper: getTestWrapper(store),
      });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericQuery = ChimericQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericQuery();

      // @ts-expect-error - Testing type error
      await chimericQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });
});
