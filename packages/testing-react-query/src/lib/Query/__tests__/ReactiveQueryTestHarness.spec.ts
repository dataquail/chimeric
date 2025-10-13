import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { QueryTestFixtures } from '../../__tests__/queryFixtures';

describe('ReactiveQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error - should error because params are not expected
      ReactiveQueryTestHarness({
        reactiveQuery,
        wrapper: getTestWrapper(queryClient),
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - should error because params are expected
      ReactiveQueryTestHarness({
        reactiveQuery,
        wrapper: getTestWrapper(queryClient),
      });

      ReactiveQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveQuery,
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - should error because wrong params
      ReactiveQueryTestHarness({
        reactiveQuery,
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ReactiveQueryTestHarness({
        reactiveQuery,
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });
});
