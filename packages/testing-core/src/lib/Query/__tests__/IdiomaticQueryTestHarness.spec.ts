import { QueryTestFixtures } from '../../__tests__/queryFixtures';
import { IdiomaticQueryTestHarness } from '../IdiomaticQueryTestHarness';

describe('IdiomaticQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { idiomaticQuery } = QueryTestFixtures.withoutParams.getIdiomatic();
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
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticQuery).toHaveBeenCalledWith();
  });

  it('USAGE: with params', async () => {
    const { idiomaticQuery } = QueryTestFixtures.withParams.getIdiomatic();
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
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    const queryWithParams = IdiomaticQueryTestHarness({
      idiomaticQuery,
      params: { name: 'John' },
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
    expect(queryWithParams.result.current.data).toBe('Hello John');
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });

    const queryNoParams = IdiomaticQueryTestHarness({
      idiomaticQuery,
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
    expect(queryNoParams.result.current.data).toBe('Hello');
    expect(idiomaticQuery).toHaveBeenCalledTimes(2);
    expect(idiomaticQuery).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: reinvokeIdiomaticFn', async () => {
    const { idiomaticQuery } = QueryTestFixtures.withoutParams.getIdiomatic();
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
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(idiomaticQuery).toHaveBeenCalledWith();

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(idiomaticQuery).toHaveBeenCalledTimes(2);
    expect(idiomaticQuery).toHaveBeenCalledWith();
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticQuery } = QueryTestFixtures.withoutParams.getIdiomatic();

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

  it('TYPE ERRORS: with params', () => {
    const { idiomaticQuery } = QueryTestFixtures.withParams.getIdiomatic();

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

      IdiomaticQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        idiomaticQuery,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because wrong params
      IdiomaticQueryTestHarness({
        idiomaticQuery,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      IdiomaticQueryTestHarness({
        idiomaticQuery,
        params: 1,
      });

      IdiomaticQueryTestHarness({
        idiomaticQuery,
      });
    } catch {
      // Expected errors
    }
  });
});
