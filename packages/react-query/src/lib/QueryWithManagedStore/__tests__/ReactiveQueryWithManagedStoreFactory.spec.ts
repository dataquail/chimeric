import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveQueryWithManagedStoreFactory } from '../ReactiveQueryWithManagedStoreFactory';

describe('ReactiveQueryWithManagedStoreFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
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
    const { result } = renderHook(reactiveQuery.useQuery, {
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
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
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
    const { result } = renderHook(
      () => reactiveQuery.useQuery({ name: 'John' }),
      { wrapper: getTestWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
