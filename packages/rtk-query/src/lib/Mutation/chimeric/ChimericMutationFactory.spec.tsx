import { configureStore } from '@reduxjs/toolkit';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericMutationFactory } from './ChimericMutationFactory';

const createTestApi = () =>
  createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: (build) => ({
      createTest: build.mutation<{ id: string }, { name: string }>({
        queryFn: async (args) => ({ data: { id: `id-${args.name}` } }),
      }),
      createTestNoParams: build.mutation<{ id: string }, void>({
        queryFn: async () => ({ data: { id: 'id-void' } }),
      }),
    }),
  });

const createTestStore = (api: ReturnType<typeof createTestApi>) =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

describe('ChimericMutationFactory', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTestNoParams,
    });

    const result = await chimericMutation();

    expect(result).toEqual({ id: 'id-void' });
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTest,
    });

    const result = await chimericMutation({ name: 'John' });

    expect(result).toEqual({ id: 'id-John' });
  });

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTestNoParams,
    });

    const { result } = renderHook(() => chimericMutation.useHook(), {
      wrapper: getTestWrapper(store),
    });

    expect(result.current.isIdle).toBe(true);

    let invokeResult: { id: string } | undefined;
    await act(async () => {
      invokeResult = await result.current.invoke();
    });

    expect(invokeResult).toEqual({ id: 'id-void' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ id: 'id-void' });
  });

  it('USAGE: REACTIVE: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTest,
    });

    const { result } = renderHook(() => chimericMutation.useHook(), {
      wrapper: getTestWrapper(store),
    });

    expect(result.current.isIdle).toBe(true);

    let invokeResult: { id: string } | undefined;
    await act(async () => {
      invokeResult = await result.current.invoke({ name: 'John' });
    });

    expect(invokeResult).toEqual({ id: 'id-John' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({ id: 'id-John' });
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTestNoParams,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTest,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation();

      // @ts-expect-error - Testing type error
      await chimericMutation({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: with params invoke', async () => {
    const api = createTestApi();
    const store = createTestStore(api);
    const chimericMutation = ChimericMutationFactory({
      store,
      endpoint: api.endpoints.createTest,
    });

    const { result } = renderHook(() => chimericMutation.useHook(), {
      wrapper: getTestWrapper(store),
    });

    try {
      // @ts-expect-error - Testing type error
      await result.current.invoke();

      // @ts-expect-error - Testing type error
      await result.current.invoke({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });
});
