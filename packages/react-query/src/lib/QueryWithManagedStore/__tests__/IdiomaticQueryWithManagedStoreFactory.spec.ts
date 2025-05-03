import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryWithManagedStoreFactory } from '../IdiomaticQueryWithManagedStoreFactory';

describe('IdiomaticQueryWithManagedStoreFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: async () => {
            await mockQueryFn();
            storeValue = 'test';
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
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
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
});
