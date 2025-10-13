import { fuseChimericAsync } from '@chimeric/core';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';
import { ChimericAsyncTestHarness } from '../ChimericAsyncTestHarness';

describe('ChimericAsyncTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { idiomaticAsync, reactiveAsync, invokeFn } =
      AsyncTestFixtures.withoutParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
    });

    const result = await harness.result.current.invoke();

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { idiomaticAsync, reactiveAsync, invokeFn } =
      AsyncTestFixtures.withParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
    });

    const result = await harness.result.current.invoke({ name: 'John' });

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { idiomaticAsync, reactiveAsync, invokeFn } =
      AsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
    });

    const result1 = await harness.result.current.invoke();

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledWith();
    expect(result1).toBe('Hello');

    const result2 = await harness.result.current.invoke({ name: 'Jane' });

    expect(invokeFn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withoutParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.invoke();

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticAsync).toHaveBeenCalledTimes(1);
    expect(harness.result.current.data).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.invoke({ name: 'John' });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticAsync).toHaveBeenCalledTimes(1);
    expect(harness.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.invoke();

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticAsync).toHaveBeenCalledTimes(1);
    expect(harness.result.current.data).toBe('Hello');

    harness.result.current.invoke({ name: 'Jane' });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticAsync).toHaveBeenCalledTimes(2);
    expect(harness.result.current.data).toBe('Hello Jane');
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withoutParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
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

  it('TYPE ERRORS: REACTIVE: with optional params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'reactive',
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

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withoutParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
    });

    try {
      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getChimeric();

    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync,
      method: 'idiomatic',
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
