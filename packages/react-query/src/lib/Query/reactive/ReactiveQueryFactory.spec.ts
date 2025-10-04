import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  ReactiveQueryWithOptionalParamsReturnsString,
  ReactiveQueryWithoutParamsReturnsString,
  ReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';

describe('ReactiveQueryFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: mockQueryFn,
        }),
    });

    const { result } = renderHook(reactiveQuery.use, {
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
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const chimericQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    });
    const { result } = renderHook(() => chimericQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the reactive hook with non-object params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const chimericQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    });
    const { result } = renderHook(() => chimericQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should disable the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: mockQueryFn,
        }),
    });
    const { result } = renderHook(
      () => reactiveQuery.use({ options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('should disable the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    });
    const { result } = renderHook(
      () =>
        reactiveQuery.use({ name: 'John' }, { options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('should disable the reactive hook with non-object params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    });
    const { result } = renderHook(
      () =>
        reactiveQuery.use({ name: 'John' }, { options: { enabled: false } }),
      { wrapper: getTestWrapper(queryClient) },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockQueryFn).not.toHaveBeenCalled();
  });

  it('should handle type annotations without params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithoutParamsReturnsString =
      ReactiveQueryFactory({
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn: mockQueryFn,
          }),
      });

    const { result } = renderHook(() => reactiveQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithParamsReturnsString =
      ReactiveQueryFactory({
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: async () => mockQueryFn(args),
          }),
      });
    const { result } = renderHook(() => reactiveQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('Hello John');
    expect(result.current.refetch).toBeDefined();
  });

  it('should handle optional params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(async (params?: { name: string }) =>
      params ? `Hello ${params?.name}` : 'Hello',
    );
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: async () => mockQueryFn(args),
        }),
    });

    const { result } = renderHook(
      () =>
        reactiveQuery.use(
          { name: 'John' },
          { nativeOptions: { staleTime: 1000 } },
        ),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations with optional params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = vi.fn(async (params?: { name: string }) =>
      params ? `Hello ${params?.name}` : 'Hello',
    );
    const reactiveQuery: ReactiveQueryWithOptionalParamsReturnsString =
      ReactiveQueryFactory({
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: async () => mockQueryFn(args),
          }),
      });
    const { result } = renderHook(() => reactiveQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledWith(undefined);
  });
});
