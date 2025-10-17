import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';
import { IdiomaticInfiniteQueryTestHarness } from '../IdiomaticInfiniteQueryTestHarness';

describe('IdiomaticInfiniteQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
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
    expect(query.result.current.data?.pages).toHaveLength(2);
    expect(query.result.current.data?.pageParams).toEqual(['', 'cursor-2']);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith();
  });

  it('USAGE: with params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();
    const query = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
      params: { filter: 'active' },
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
    expect(query.result.current.data?.pages).toHaveLength(1);
    expect(query.result.current.data?.pages[0].data[0]).toBe(
      'Filtered active Item 1',
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ filter: 'active' });
  });

  it('USAGE: with optional params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();

    const queryWithParams = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
      params: { filter: 'active' },
    });

    expect(queryWithParams.result.current.isIdle).toBe(false);
    expect(queryWithParams.result.current.isPending).toBe(true);
    expect(queryWithParams.result.current.isSuccess).toBe(false);
    expect(queryWithParams.result.current.isError).toBe(false);
    expect(queryWithParams.result.current.error).toBe(null);
    expect(queryWithParams.result.current.data).toBe(undefined);

    await queryWithParams.waitFor(() =>
      expect(queryWithParams.result.current.isSuccess).toBe(true),
    );

    expect(queryWithParams.result.current.isSuccess).toBe(true);
    expect(queryWithParams.result.current.isPending).toBe(false);
    expect(queryWithParams.result.current.isError).toBe(false);
    expect(queryWithParams.result.current.error).toBe(null);
    expect(queryWithParams.result.current.data).toBeDefined();
    expect(queryWithParams.result.current.data?.pages[0].data[0]).toBe(
      'Filtered active Item 1',
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ filter: 'active' });

    const queryNoParams = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery,
    });

    expect(queryNoParams.result.current.isIdle).toBe(false);
    expect(queryNoParams.result.current.isPending).toBe(true);
    expect(queryNoParams.result.current.isSuccess).toBe(false);
    expect(queryNoParams.result.current.isError).toBe(false);
    expect(queryNoParams.result.current.error).toBe(null);
    expect(queryNoParams.result.current.data).toBe(undefined);

    await queryNoParams.waitFor(() =>
      expect(queryNoParams.result.current.isSuccess).toBe(true),
    );

    expect(queryNoParams.result.current.isSuccess).toBe(true);
    expect(queryNoParams.result.current.isPending).toBe(false);
    expect(queryNoParams.result.current.isError).toBe(false);
    expect(queryNoParams.result.current.error).toBe(null);
    expect(queryNoParams.result.current.data).toBeDefined();
    expect(queryNoParams.result.current.data?.pages[0].data[0]).toBe(
      'All Items 1',
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(2);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: reinvokeIdiomaticFn', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
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
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith();

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBeDefined();
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(2);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith();
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because params are not expected
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
        params: { filter: 'active' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();

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

      IdiomaticInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        idiomaticInfiniteQuery,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because wrong params
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
        params: 1,
      });

      IdiomaticInfiniteQueryTestHarness({
        idiomaticInfiniteQuery,
      });
    } catch {
      // Expected errors
    }
  });
});
