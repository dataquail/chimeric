import { act } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericQueryFactory } from './ChimericQueryFactory';

describe('ChimericQueryFactory - Behavior', () => {
  describe('BEHAVIOR: enabled option', () => {
    it('does not fetch when enabled is false (void params)', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, void>({
            queryFn: async () => ({ data: 'fetched' }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      const { result } = renderHook(
        () => chimericQuery.useHook({ options: { enabled: false } }),
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
          getTest: build.query<string, { name: string }>({
            queryFn: async (args) => ({ data: `Hello ${args.name}` }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      const { result } = renderHook(
        () =>
          chimericQuery.useHook(
            { name: 'John' },
            { options: { enabled: false } },
          ),
        { wrapper: getTestWrapper(store) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('fetches when enabled is explicitly true (void params)', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, void>({
            queryFn: async () => ({ data: 'fetched' }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      const { result } = renderHook(
        () => chimericQuery.useHook({ options: { enabled: true } }),
        { wrapper: getTestWrapper(store) },
      );

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toBe('fetched');
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('BEHAVIOR: forceRefetch option', () => {
    it('returns cached data when forceRefetch is not set', async () => {
      let callCount = 0;
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, { name: string }>({
            queryFn: async (args) => ({
              data: `${args.name}-call-${++callCount}`,
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      const result1 = await chimericQuery({ name: 'John' });
      expect(result1).toBe('John-call-1');

      const result2 = await chimericQuery({ name: 'John' });
      expect(result2).toBe('John-call-1');
    });

    it('bypasses cache when forceRefetch is true', async () => {
      let callCount = 0;
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, { name: string }>({
            queryFn: async (args) => ({
              data: `${args.name}-call-${++callCount}`,
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      const result1 = await chimericQuery({ name: 'John' });
      expect(result1).toBe('John-call-1');

      const result2 = await chimericQuery(
        { name: 'John' },
        { options: { forceRefetch: true } },
      );
      expect(result2).toBe('John-call-2');
    });
  });

  describe('BEHAVIOR: reactive refetch', () => {
    it('returns fresh data on refetch', async () => {
      let callCount = 0;
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, void>({
            queryFn: async () => ({
              data: `call-${++callCount}`,
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
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
        expect(result.current.data).toBe('call-1');
      });

      let refetchData: string | undefined;
      await act(async () => {
        refetchData = await result.current.refetch();
      });

      expect(refetchData).toBe('call-2');

      await waitFor(() => {
        expect(result.current.data).toBe('call-2');
      });
    });
  });

  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, void>({
            queryFn: async () => ({
              error: { status: 500, data: 'fetch failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
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
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });

    it('throws errors in idiomatic interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          getTest: build.query<string, void>({
            queryFn: async () => ({
              error: { status: 500, data: 'fetch failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericQuery = ChimericQueryFactory({
        store,
        endpoint: api.endpoints.getTest,
        endpointName: 'getTest',
        api,
      });

      await expect(chimericQuery()).rejects.toThrow();
    });
  });
});
