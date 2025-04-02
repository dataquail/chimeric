import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryWithManagedStoreFactory } from '../IdiomaticQueryWithManagedStoreFactory';

describe('IdiomaticQueryWithManagedStoreFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory(queryClient, {
      queryFn: async () => {
        await mockQueryFn();
        storeValue = 'test';
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
        }),
      getFromStore: () => storeValue,
    });
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory(queryClient, {
      queryFn: async (args: { name: string }) => {
        storeValue = await mockQueryFn(args);
      },
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
        }),
      getFromStore: () => storeValue,
    });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
