import { IdiomaticQueryTestHarness } from '../IdiomaticQueryTestHarness';
import { QueryTestFixtures } from '../../__tests__/queryFixtures';
import { QueryClient } from '@tanstack/react-query';

describe('IdiomaticQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, fn } =
      QueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    const query = IdiomaticQueryTestHarness({
      idiomaticQuery,
    });

    expect(query.result.current.isIdle).toBe(false);
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
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: no params - reinvokeIdiomaticFn', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, fn } =
      QueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    const query = IdiomaticQueryTestHarness({
      idiomaticQuery,
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('test');
    expect(fn).toHaveBeenCalledTimes(1);

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.data).toBe('test');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, fn } =
      QueryTestFixtures.withParams.getIdiomatic(queryClient);

    const query = IdiomaticQueryTestHarness({
      idiomaticQuery,
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
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
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, fn } =
      QueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    const query = IdiomaticQueryTestHarness({
      idiomaticQuery,
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, fn } =
      QueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    const query = IdiomaticQueryTestHarness({
      idiomaticQuery,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello');
    expect(fn).toHaveBeenCalledWith(undefined);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery } =
      QueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because params are not expected
      IdiomaticQueryTestHarness({
        idiomaticQuery,
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery } =
      QueryTestFixtures.withParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      IdiomaticQueryTestHarness({
        idiomaticQuery,
      });

      IdiomaticQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        idiomaticQuery,
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      IdiomaticQueryTestHarness({
        idiomaticQuery,
        params: { wrong: 'param' },
      });

      IdiomaticQueryTestHarness({
        idiomaticQuery,
      });
    } catch {
      // Expected error
    }
  });
});
