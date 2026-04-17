import { QueryClient, queryOptions } from '@tanstack/vue-query';
import { ChimericQueryFactory } from './ChimericQueryFactory';
import { withQuerySetup, flushPromises } from '../../__tests__/getTestWrapper';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('ChimericQueryFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn,
        }),
    });

    const { result } = withQuerySetup(() => chimericQuery.useHook(), queryClient);

    await flushPromises();

    expect(result.isPending.value).toBe(false);
    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(queryFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => queryFn(args),
        }),
    });

    const { result } = withQuerySetup(
      () => chimericQuery.useHook({ name: 'John' }),
      queryClient,
    );

    await flushPromises();

    expect(result.isPending.value).toBe(false);
    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const chimericQuery = ChimericQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => queryFn(args),
        }),
    });

    const { result: resultWithParams } = withQuerySetup(
      () => chimericQuery.useHook({ name: 'John' }),
      queryClient,
    );

    await flushPromises();

    expect(resultWithParams.isPending.value).toBe(false);
    expect(resultWithParams.isSuccess.value).toBe(true);
    expect(resultWithParams.data.value).toBe('Hello John');
    expect(queryFn).toHaveBeenCalledWith({ name: 'John' });

    const queryClient2 = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result: resultWithoutParams } = withQuerySetup(
      () => chimericQuery.useHook(),
      queryClient2,
    );

    await flushPromises();

    expect(resultWithoutParams.isPending.value).toBe(false);
    expect(resultWithoutParams.isSuccess.value).toBe(true);
    expect(resultWithoutParams.data.value).toBe('Hello');
    expect(queryFn).toHaveBeenCalledWith(undefined);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
      withQuerySetup(() => chimericQuery.useHook({ name: 'John' }), queryClient);
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const { queryFn } = QueryTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
      withQuerySetup(() => chimericQuery.useHook(), queryClient);

      // @ts-expect-error - Testing type error
      withQuerySetup(() => chimericQuery.useHook({ wrong: 'param' }), queryClient);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
      withQuerySetup(() => chimericQuery.useHook({ wrong: 'param' }), queryClient);

      withQuerySetup(() => chimericQuery.useHook(), queryClient);
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
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
