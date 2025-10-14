import { ReactiveEagerAsyncTestHarness } from '../ReactiveEagerAsyncTestHarness';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('ReactiveEagerAsyncTestHarness', () => {
  // USAGE
  it('USAGE: no params', () => {
    const { reactiveEagerAsync, fn } =
      EagerAsyncTestFixtures.withoutParams.getReactive();

    const harness = ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync,
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(undefined);
    expect(harness.result.current.data).toBe('test');
    expect(harness.result.current.isIdle).toBe(true);
  });

  it('USAGE: with params', () => {
    const { reactiveEagerAsync, fn } =
      EagerAsyncTestFixtures.withParams.getReactive();

    const harness = ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync,
      params: { name: 'John' },
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'John' }, undefined);
    expect(harness.result.current.data).toBe('Hello John');
  });

  it('USAGE: with optional params', () => {
    const { reactiveEagerAsync, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync,
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(undefined);
    expect(harness.result.current.data).toBe('Hello');
  });

  it('USAGE: with optional params provided', () => {
    const { reactiveEagerAsync, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync,
      params: { name: 'Jane' },
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' }, undefined);
    expect(harness.result.current.data).toBe('Hello Jane');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error - should error because params are not expected
      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - should error because params are required
      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
      });

      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
        // @ts-expect-error - should error because wrong params
        params: { wrong: 'param' },
      });

      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
        // @ts-expect-error - should error because wrong params
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - should error because wrong params
      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
        params: 1,
      });

      ReactiveEagerAsyncTestHarness({
        reactiveEagerAsync,
      });
    } catch {
      // Expected errors
    }
  });
});
