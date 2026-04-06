import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from './ChimericQueryFactory.server';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('ChimericQueryFactoryServer', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    const result = await chimericQuery();

    expect(result).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    const result = await chimericQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    const resultWithParams = await chimericQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await chimericQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // USAGE: PREFETCH
  it('USAGE: PREFETCH: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test-prefetch'],
          queryFn,
        }),
    });

    await expect(chimericQuery.prefetch()).resolves.toBeUndefined();
  });

  it('USAGE: PREFETCH: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test-prefetch', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    await expect(
      chimericQuery.prefetch({ name: 'John' }),
    ).resolves.toBeUndefined();
  });

  it('USAGE: PREFETCH: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test-prefetch', args.name] : ['test-prefetch'],
          queryFn: () => queryFn(args),
        }),
    });

    await expect(
      chimericQuery.prefetch({ name: 'John' }),
    ).resolves.toBeUndefined();
    await expect(chimericQuery.prefetch()).resolves.toBeUndefined();
  });

  // SERVER ERRORS: useHook
  it('SERVER ERRORS: useHook throws', () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    expect(() => chimericQuery.useHook()).toThrow(
      "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // SERVER ERRORS: usePrefetchHook
  it('SERVER ERRORS: usePrefetchHook throws', () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    expect(() => chimericQuery.usePrefetchHook()).toThrow(
      "@chimeric/react-query: usePrefetchHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // SERVER ERRORS: useSuspenseHook
  it('SERVER ERRORS: useSuspenseHook throws', () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    expect(() => chimericQuery.useSuspenseHook()).toThrow(
      "@chimeric/react-query: useSuspenseHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericQuery();

      // @ts-expect-error - Testing type error
      await chimericQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericQuery({ wrong: 'param' });

      await chimericQuery();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericQueryFactory({
      queryClient: new QueryClient(),
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericQueryFactory({
      queryClient: new QueryClient(),
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericQueryFactory({
      queryClient: new QueryClient(),
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });
    expect(testAnnotation).toBeDefined();
  });
});
