import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../IdiomaticQueryFactory';

describe('IdiomaticQueryFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    const idiomaticQuery = IdiomaticQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
      }),
    );
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const idiomaticQuery = IdiomaticQueryFactory(
      queryClient,
      (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    );
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
