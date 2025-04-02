import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from '../ChimericQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ChimericQueryFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    const chimericQuery = ChimericQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
      }),
    );
    const { result } = renderHook(chimericQuery.useQuery, {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    const chimericQuery = ChimericQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
      }),
    );
    const result = await chimericQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericQuery = ChimericQueryFactory(
      queryClient,
      (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    );
    const { result } = renderHook(
      () => chimericQuery.useQuery({ name: 'John' }),
      { wrapper: getTestWrapper(queryClient) },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericQuery = ChimericQueryFactory(
      queryClient,
      (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    );
    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
