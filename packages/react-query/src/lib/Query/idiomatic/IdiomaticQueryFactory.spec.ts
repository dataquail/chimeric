import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('IdiomaticQueryFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
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
    const { queryFn } = QueryTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery();

      // @ts-expect-error - Testing type error
      await idiomaticQuery({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticQuery({ wrong: 'param' });

      await idiomaticQuery();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, queryFn } =
      QueryTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticQueryFactory({
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
    const { annotation: _annotation, queryFn } = QueryTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticQueryFactory({
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
      QueryTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticQueryFactory({
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
