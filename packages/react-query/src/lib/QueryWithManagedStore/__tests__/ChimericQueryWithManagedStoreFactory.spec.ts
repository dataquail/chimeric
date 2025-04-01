import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryWithManagedStoreFactory } from '../ChimericQueryWithManagedStoreFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ChimericQueryWithManagedStoreFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      queryFn: async () => {
        await mockQueryFn();
        storeValue = 'test';
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(chimericQuery.useQuery, {
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
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      queryFn: async () => {
        await mockQueryFn();
        storeValue = 'test';
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
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
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      queryFn: async (args: { name: string }) => {
        storeValue = await mockQueryFn(args);
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const { result } = renderHook(
      () => chimericQuery.useQuery({ name: 'John' }),
      { wrapper: getTestWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory(queryClient, {
      queryFn: async (args: { name: string }) => {
        storeValue = await mockQueryFn(args);
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });
    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
