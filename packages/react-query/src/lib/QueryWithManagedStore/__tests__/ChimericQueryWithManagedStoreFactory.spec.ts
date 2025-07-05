import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryWithManagedStoreFactory } from '../ChimericQueryWithManagedStoreFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { DefineChimericQuery } from '../../Query/chimeric/types';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ChimericQueryWithManagedStoreFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue = 'initial';
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn();
          },
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(chimericQuery.use, {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue = 'initial';
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn();
          },
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const result = await chimericQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue = 'initial';
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn(args);
          },
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(() => chimericQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue = 'initial';
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn(args);
          },
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations with no params', async () => {
    type TestChimericQuery = DefineChimericQuery<
      () => Promise<string>,
      Error,
      string[]
    >;
    const queryClient = new QueryClient();
    const chimericQuery: TestChimericQuery =
      ChimericQueryWithManagedStoreFactory(queryClient, {
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn: async () => {
              return;
            },
          }),
        getFromStore: () => 'test',
        useFromStore: () => 'test',
      });

    const result = await chimericQuery();

    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    type TestChimericQuery = DefineChimericQuery<
      (args: { name: string }) => Promise<string>,
      Error,
      string[]
    >;
    const queryClient = new QueryClient();
    const chimericQuery: TestChimericQuery =
      ChimericQueryWithManagedStoreFactory(queryClient, {
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: async () => {
              return;
            },
          }),
        getFromStore: (args) => `Hello ${args.name}`,
        useFromStore: (args) => `Hello ${args.name}`,
      });

    const result = await chimericQuery({
      name: 'John',
    });

    expect(result).toBe('Hello John');
  });
});
