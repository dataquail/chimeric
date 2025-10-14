import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';
import { IdiomaticEagerAsyncTestHarness } from '../IdiomaticEagerAsyncTestHarness';

describe('IdiomaticEagerAsyncTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { idiomaticEagerAsync, fn } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const harness = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync,
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe('test');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const { idiomaticEagerAsync, fn } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();
    const harness = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync,
      params: { name: 'John' },
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe('Hello John');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'John' }, undefined);
  });

  it('USAGE: with optional params', async () => {
    const { idiomaticEagerAsync, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    const harness = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync,
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBe('Hello');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: with optional params provided', async () => {
    const { idiomaticEagerAsync, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    const harness = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync,
      params: { name: 'Jane' },
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' }, undefined);
  });

  it('USAGE: reinvokeIdiomaticFn', async () => {
    const { idiomaticEagerAsync, fn } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const harness = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync,
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(fn).toHaveBeenCalledTimes(1);

    await harness.waitFor(
      () => expect(harness.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(fn).toHaveBeenCalledTimes(2);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because params are not expected
      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because params are required
      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
      });

      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
        // @ts-expect-error - should error because wrong params
        params: { wrong: 'param' },
      });

      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
        // @ts-expect-error - should error because wrong params
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error - should error because wrong params
      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
        params: { wrong: 'param' },
      });

      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
        // @ts-expect-error - should error because wrong params
        params: 1,
      });

      IdiomaticEagerAsyncTestHarness({
        idiomaticEagerAsync,
      });
    } catch {
      // Expected errors
    }
  });
});
