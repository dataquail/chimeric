import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryWithManagedStoreFactory } from '../ChimericQueryWithManagedStoreFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { DefineChimericQuery } from '../../Query/chimeric/types';

describe('ChimericQueryWithManagedStoreFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      storeValue = 'test';
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const { result } = renderHook(() => chimericQuery.use(), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args: { name: string }) => {
      storeValue = `Hello ${args.name}`;
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const { result } = renderHook(() => chimericQuery.use({ name: 'John' }), {
      wrapper: getTestWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args?: { name: string }) => {
      storeValue = args ? `Hello ${args.name}` : 'Hello';
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const { result: resultWithParams } = renderHook(
      () => chimericQuery.use({ name: 'John' }),
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
      () => chimericQuery.use(),
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

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      storeValue = 'test';
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const result = await chimericQuery();

    expect(result).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args: { name: string }) => {
      storeValue = `Hello ${args.name}`;
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args?: { name: string }) => {
      storeValue = args ? `Hello ${args.name}` : 'Hello';
    });
    let storeValue: string | null = null;
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
      useFromStore: () => storeValue,
    });

    const resultWithParams = await chimericQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await chimericQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      renderHook(() => chimericQuery.use({ name: 'John' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      renderHook(() => chimericQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - should error because wrong params
      renderHook(() => chimericQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - should error because wrong params
      renderHook(() => chimericQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });

      renderHook(() => chimericQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      await chimericQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - params expected
      await chimericQuery();

      // @ts-expect-error - should error because wrong params
      await chimericQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const chimericQuery = ChimericQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
      useFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - should error because wrong params
      await chimericQuery({ wrong: 'param' });

      await chimericQuery();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const _annotation = {} as DefineChimericQuery<
      () => Promise<string>,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      ChimericQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn,
          }),
        getFromStore: () => 'test',
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const _annotation = {} as DefineChimericQuery<
      (args: { name: string }) => Promise<string>,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      ChimericQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => queryFn(args),
          }),
        getFromStore: () => 'test',
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const _annotation = {} as DefineChimericQuery<
      (args?: { name: string }) => Promise<string>,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      ChimericQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: () => queryFn(args),
          }),
        getFromStore: () => 'test',
        useFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });
});
