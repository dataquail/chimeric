import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryWithManagedStoreFactory } from '../IdiomaticQueryWithManagedStoreFactory';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticQueryWithoutParamsReturnsString,
  IdiomaticQueryWithParamsReturnsString,
} from '../../Query/__tests__/queryFixtures';

describe('IdiomaticQueryWithManagedStoreFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn();
          },
        }),
      getFromStore: () => storeValue,
    });
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            storeValue = await mockQueryFn(args);
          },
        }),
      getFromStore: () => storeValue,
    });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations without params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    let storeValue = 'initial';
    const idiomaticQuery: IdiomaticQueryWithoutParamsReturnsString =
      IdiomaticQueryWithManagedStoreFactory(queryClient, {
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn: async () => {
              storeValue = await mockQueryFn();
            },
          }),
        getFromStore: () => storeValue,
      });
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    let storeValue = 'initial';
    const idiomaticQuery: IdiomaticQueryWithParamsReturnsString =
      IdiomaticQueryWithManagedStoreFactory(queryClient, {
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test'],
            queryFn: async () => {
              storeValue = await mockQueryFn(args);
            },
          }),
        getFromStore: () => storeValue,
      });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
