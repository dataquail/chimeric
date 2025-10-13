import { QueryClient, queryOptions } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveQueryWithManagedStoreFactory } from '../ReactiveQueryWithManagedStoreFactory';
import { ReactiveQuery } from '../../Query/reactive/types';

describe('ReactiveQueryWithManagedStoreFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      storeValue = 'test';
    });
    let storeValue: string | null = null;
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      useFromStore: () => storeValue,
    });

    const { result } = renderHook(() => reactiveQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args: { name: string }) => {
      storeValue = `Hello ${args.name}`;
    });
    let storeValue: string | null = null;
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      useFromStore: () => storeValue,
    });

    const { result } = renderHook(() => reactiveQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args?: { name: string }) => {
      storeValue = args ? `Hello ${args.name}` : 'Hello';
    });
    let storeValue: string | null = null;
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      useFromStore: () => storeValue,
    });

    const { result: resultWithParams } = renderHook(
      () => reactiveQuery.use({ name: 'John' }),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithParams.current.isPending).toBe(false);
    });

    expect(resultWithParams.current.isSuccess).toBe(true);
    expect(resultWithParams.current.data).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const { result: resultWithoutParams } = renderHook(
      () => reactiveQuery.use(),
      {
        wrapper: getTestWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(resultWithoutParams.current.isPending).toBe(false);
    });

    expect(resultWithoutParams.current.isSuccess).toBe(true);
    expect(resultWithoutParams.current.data).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      renderHook(() => reactiveQuery.use({ name: 'John' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      renderHook(() => reactiveQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - should error because wrong params
      renderHook(() => reactiveQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const reactiveQuery = ReactiveQueryWithManagedStoreFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - should error because wrong params
      renderHook(() => reactiveQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => reactiveQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const _annotation = {} as ReactiveQuery<void, string, Error, string[]>;
    const testAnnotation: typeof _annotation =
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn,
          }),
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const _annotation = {} as ReactiveQuery<
      { name: string },
      string,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => queryFn(args),
          }),
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const _annotation = {} as ReactiveQuery<
      { name: string } | undefined,
      string,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: () => queryFn(args),
          }),
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });
});
