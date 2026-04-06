import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryWithManagedStoreFactory } from '../ChimericQueryWithManagedStoreFactory.server';
import { DefineChimericQuery } from '../../Query/chimeric/types';

describe('ChimericQueryWithManagedStoreFactoryServer', () => {
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

  // SERVER ERRORS: useHook
  it('SERVER ERRORS: useHook throws', () => {
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

    expect(() => chimericQuery.useHook()).toThrow(
      "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // SERVER ERRORS: usePrefetchHook
  it('SERVER ERRORS: usePrefetchHook throws', () => {
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

    expect(() => chimericQuery.usePrefetchHook()).toThrow(
      "@chimeric/react-query: usePrefetchHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // SERVER ERRORS: useSuspenseHook
  it('SERVER ERRORS: useSuspenseHook throws', () => {
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

    expect(() => chimericQuery.useSuspenseHook()).toThrow(
      "@chimeric/react-query: useSuspenseHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
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
