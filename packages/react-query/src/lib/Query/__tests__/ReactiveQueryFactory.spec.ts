import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveQueryFactory } from '../ReactiveQueryFactory';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ReactiveQueryFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    const reactiveQuery = ReactiveQueryFactory(() =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
      }),
    );
    const { result } = renderHook(reactiveQuery.useQuery, {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with object params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericQuery = ReactiveQueryFactory((args: { name: string }) =>
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

  it('should invoke the reactive hook with non-object params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericQuery = ReactiveQueryFactory((args: { name: string }) =>
      queryOptions({
        queryKey: ['test', args.name],
        queryFn: async () => mockQueryFn(args),
      }),
    );
    const { result } = renderHook(
      () => chimericQuery.useQuery({ name: 'John' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should disable the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(() => Promise.resolve('test'));
    const reactiveQuery = ReactiveQueryFactory(() =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
      }),
    );
    const { result } = renderHook(
      () => reactiveQuery.useQuery({ options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('should disable the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { name: string }) =>
      queryOptions({
        queryKey: ['test', args.name],
        queryFn: async () => mockQueryFn(args),
      }),
    );
    const { result } = renderHook(
      () =>
        reactiveQuery.useQuery({ name: 'John', options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('should disable the reactive hook with non-object params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { name: string }) =>
      queryOptions({
        queryKey: ['test', args.name],
        queryFn: async () => mockQueryFn(args),
      }),
    );
    const { result } = renderHook(
      () =>
        reactiveQuery.useQuery({ name: 'John', options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  // it('should throw type error when params include enabled', async () => {
  //   const queryClient = new QueryClient();
  //   const mockQueryFn = vi.fn((args: { name: string; enabled: boolean }) =>
  //     Promise.resolve(`Hello ${args.name}`),
  //   );
  //   const reactiveQuery = ReactiveQueryFactory(
  //     (args: { name: string; enabled: boolean }) =>
  //       queryOptions({
  //         queryKey: ['test', args.name],
  //         queryFn: async () => mockQueryFn(args),
  //       }),
  //   );
  //   renderHook(
  //     () =>
  //       reactiveQuery.useQuery(
  //         { name: 'John', enabled: true },
  //         { enabled: false },
  //       ),
  //     { wrapper: getTestWrapper(queryClient) },
  //   );
  // });
});
