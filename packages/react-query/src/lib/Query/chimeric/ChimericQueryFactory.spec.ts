import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from '../chimeric/ChimericQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('ChimericQueryFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
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

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
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
      renderHook(() => chimericQuery.use({ name: 'John' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
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
      renderHook(() => chimericQuery.use(), {
        wrapper: getTestWrapper(queryClient),
      });

      // @ts-expect-error - Testing type error
      renderHook(() => chimericQuery.use({ wrong: 'param' }), {
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
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
    const { annotation: _annotation, queryFn } = QueryTestFixtures.withParams.getChimeric();
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
