import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveQueryWithManagedStoreFactory } from '../ReactiveQueryWithManagedStoreFactory';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  ReactiveQueryWithoutParamsReturnsString,
  ReactiveQueryWithParamsReturnsString,
} from '../../Query/__tests__/queryFixtures';

describe('ReactiveQueryWithManagedStoreFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue: string | null = null;
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            await mockQueryFn();
            storeValue = 'test';
          },
        }),
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(reactiveQuery.use, {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue: string | null = null;
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn(args);
          },
        }),
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(() => reactiveQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations without params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue = 'initial';
    const reactiveQuery: ReactiveQueryWithoutParamsReturnsString =
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn: async () => {
              await mockQueryFn();
              storeValue = 'test';
            },
          }),
        useFromStore: () => storeValue,
      });
    const { result } = renderHook(reactiveQuery.use, {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.data).toBe('initial');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue = 'initial';
    const reactiveQuery: ReactiveQueryWithParamsReturnsString =
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test'],
            queryFn: async () => {
              storeValue = await mockQueryFn(args);
            },
          }),
        useFromStore: () => storeValue,
      });
    const { result } = renderHook(() => reactiveQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.data).toBe('initial');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
