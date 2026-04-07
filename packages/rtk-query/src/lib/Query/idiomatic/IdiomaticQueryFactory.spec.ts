import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { IdiomaticQueryFactory } from './IdiomaticQueryFactory';

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

describe('IdiomaticQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    const result = await idiomaticQuery();

    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
  });

  it('USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    const resultWithParams = await idiomaticQuery({ name: 'John' });
    expect(resultWithParams).toBe('Hello John');

    const resultWithoutParams = await idiomaticQuery();
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery();

      // @ts-expect-error - Testing type error
      await idiomaticQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery({ wrong: 'param' });

      await idiomaticQuery();
    } catch {
      // Expected error
    }
  });

  // PREFETCH USAGE
  it('PREFETCH USAGE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    await idiomaticQuery.prefetch();
  });

  it('PREFETCH USAGE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    await idiomaticQuery.prefetch({ name: 'John' });
  });

  it('PREFETCH USAGE: with optional params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithOptionalParams,
      endpointName: 'getTestWithOptionalParams',
      api,
    });

    await idiomaticQuery.prefetch({ name: 'John' });
    await idiomaticQuery.prefetch();
  });

  // PREFETCH TYPE ERRORS
  it('PREFETCH TYPE ERRORS: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTest,
      endpointName: 'getTest',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery.prefetch({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('PREFETCH TYPE ERRORS: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const idiomaticQuery = IdiomaticQueryFactory({
      store,
      endpoint: api.endpoints.getTestWithParams,
      endpointName: 'getTestWithParams',
      api,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery.prefetch();

      // @ts-expect-error - Testing type error
      await idiomaticQuery.prefetch({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });
});
