import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';
import { IdiomaticAsyncTestHarness } from '../IdiomaticAsyncTestHarness';

describe('IdiomaticAsyncTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withoutParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    harness.result.current.invoke();

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
    expect(idiomaticAsync).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    harness.result.current.invoke({ name: 'John' });

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
    expect(idiomaticAsync).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with optional params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    expect(harness.result.current.isIdle).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    harness.result.current.invoke();

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.data).toBe('Hello');
    expect(idiomaticAsync).toHaveBeenCalledTimes(1);

    harness.result.current.invoke({ name: 'Jane' });

    expect(harness.result.current.isPending).toBe(true);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.data).toBe('Hello Jane');
    expect(idiomaticAsync).toHaveBeenCalledTimes(2);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withoutParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    try {
      // @ts-expect-error - should error because params are expected
      harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();
    const harness = IdiomaticAsyncTestHarness({
      idiomaticAsync,
    });

    try {
      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);

      harness.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
