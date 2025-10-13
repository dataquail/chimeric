import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryWithManagedStoreFactory } from '../IdiomaticQueryWithManagedStoreFactory';
import { IdiomaticQuery } from '../../Query/idiomatic/types';

describe('IdiomaticQueryWithManagedStoreFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      storeValue = 'test';
    });
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => storeValue,
    });

    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args: { name: string }) => {
      storeValue = `Hello ${args.name}`;
    });
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
    });

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (args?: { name: string }) => {
      storeValue = args ? `Hello ${args.name}` : 'Hello';
    });
    let storeValue: string | null = null;
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => storeValue,
    });

    const resultWithParams = await idiomaticQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await idiomaticQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async () => {
      // No-op
    });
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
      getFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      await idiomaticQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - no params expected
      await idiomaticQuery();

      // @ts-expect-error - should error because wrong params
      await idiomaticQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const idiomaticQuery = IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
      getFromStore: () => 'test',
    });

    try {
      // @ts-expect-error - should error because wrong params
      await idiomaticQuery({ wrong: 'param' });

      await idiomaticQuery();
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
    const _annotation = {} as IdiomaticQuery<void, string, Error, string[]>;
    const testAnnotation: typeof _annotation =
      IdiomaticQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn,
          }),
        getFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });
    const _annotation = {} as IdiomaticQuery<
      { name: string },
      string,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      IdiomaticQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => queryFn(args),
          }),
        getFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const queryClient = new QueryClient();
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });
    const _annotation = {} as IdiomaticQuery<
      { name: string } | undefined,
      string,
      Error,
      string[]
    >;
    const testAnnotation: typeof _annotation =
      IdiomaticQueryWithManagedStoreFactory({
        queryClient,
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: () => queryFn(args),
          }),
        getFromStore: () => 'test',
      });
    expect(testAnnotation).toBeDefined();
  });
});
