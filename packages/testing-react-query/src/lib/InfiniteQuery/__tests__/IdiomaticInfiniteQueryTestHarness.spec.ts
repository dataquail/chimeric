import { IdiomaticInfiniteQueryTestHarness } from '../IdiomaticInfiniteQueryTestHarness';
import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';
import { QueryClient } from '@tanstack/react-query';

describe('IdiomaticInfiniteQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, fn } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
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
    expect(query.result.current.data).toBeDefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: no params - reinvokeIdiomaticFn', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, fn } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBeDefined();
    expect(fn).toHaveBeenCalledTimes(1);

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.data).toBeDefined();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, fn } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic(queryClient);

    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
      params: { filter: 'test' },
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
    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('Filtered test Item 1');
    expect(fn).toHaveBeenCalledWith({ filter: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, fn } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
      params: { filter: 'test' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('Filtered test Item 1');
    expect(fn).toHaveBeenCalledWith({ filter: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, fn } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('All Items 1');
    expect(fn).toHaveBeenCalledWith(undefined);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because params are not expected
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
        params: { filter: 'test' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
      });

      IdiomaticInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        idiomaticInfiniteQuery,
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
        params: { wrong: 'param' },
      });

      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
      });
    } catch {
      // Expected error
    }
  });
});
