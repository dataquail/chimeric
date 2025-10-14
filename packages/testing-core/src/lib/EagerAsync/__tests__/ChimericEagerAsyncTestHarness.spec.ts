import { fuseChimericEagerAsync } from '@chimeric/core';
import { ChimericEagerAsyncTestHarness } from '../ChimericEagerAsyncTestHarness';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('ChimericEagerAsyncTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'reactive',
    });

    expect(reactiveFn).toHaveBeenCalled();
    expect(harness.result.current.data).toBe('test');
  });

  it('USAGE: REACTIVE: with params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' }, undefined);
    expect(harness.result.current.data).toBe('Hello John');
  });

  it('USAGE: REACTIVE: with optional params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'reactive',
    });

    expect(reactiveFn).toHaveBeenCalledWith(undefined);
    expect(harness.result.current.data).toBe('Hello');
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, idiomaticFn } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'idiomatic',
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(harness.result.current.data).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, idiomaticFn } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'idiomatic',
      params: { name: 'John' },
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' }, undefined);
    expect(harness.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, idiomaticFn } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    const harness = ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'idiomatic',
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(harness.result.current.data).toBe('Hello');
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error - should error because params are required
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
        // @ts-expect-error - should error because wrong params
        params: { wrong: 'param' },
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
        // @ts-expect-error - should error because wrong params
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
        params: 1,
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'reactive',
      });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error - should error because params are required
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
        // @ts-expect-error - should error because wrong params
        params: { wrong: 'param' },
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
        // @ts-expect-error - should error because wrong params
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
        params: 1,
      });

      ChimericEagerAsyncTestHarness({
        chimericEagerAsync,
        method: 'idiomatic',
      });
    } catch {
      // Expected errors
    }
  });
});
