import { act } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericMutationFactory } from './ChimericMutationFactory';

describe('ChimericMutationFactory - Behavior', () => {
  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<string, void>({
            queryFn: async () => ({
              error: { status: 500, data: 'mutation failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(store),
      });

      expect(result.current.isIdle).toBe(true);

      await act(async () => {
        try {
          await result.current.invoke();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.data).toBeUndefined();
    });

    it('surfaces errors with params in reactive interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<string, { name: string }>({
            queryFn: async () => ({
              error: { status: 500, data: 'mutation failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(store),
      });

      await act(async () => {
        try {
          await result.current.invoke({ name: 'John' });
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('throws errors in idiomatic interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<string, void>({
            queryFn: async () => ({
              error: { status: 500, data: 'mutation failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      await expect(chimericMutation()).rejects.toThrow();
    });

    it('throws errors with params in idiomatic interface', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<string, { name: string }>({
            queryFn: async () => ({
              error: { status: 500, data: 'mutation failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      await expect(
        chimericMutation({ name: 'John' }),
      ).rejects.toThrow();
    });
  });

  describe('BEHAVIOR: reset', () => {
    it('returns to idle state after reset', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<{ id: string }, void>({
            queryFn: async () => ({ data: { id: 'test-id' } }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(store),
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();

      await act(async () => {
        await result.current.invoke();
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({ id: 'test-id' });

      act(() => result.current.reset());

      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('returns to idle state after error and reset', async () => {
      const api = createApi({
        baseQuery: fakeBaseQuery(),
        endpoints: (build) => ({
          createTest: build.mutation<string, void>({
            queryFn: async () => ({
              error: { status: 500, data: 'mutation failed' },
            }),
          }),
        }),
      });
      const store = configureStore({
        reducer: { [api.reducerPath]: api.reducer },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(api.middleware),
      });
      const chimericMutation = ChimericMutationFactory({
        store,
        endpoint: api.endpoints.createTest,
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(store),
      });

      await act(async () => {
        try {
          await result.current.invoke();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      act(() => result.current.reset());

      expect(result.current.isIdle).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });
});
