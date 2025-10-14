/* eslint-disable @typescript-eslint/no-explicit-any */
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

describe('fuseChimericEagerAsync', () => {
  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { idiomaticEagerAsync, idiomaticFn, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    // Test idiomatic interface - call without params
    await expect(chimericEagerAsync()).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use without params
    const reactiveResult = chimericEagerAsync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResult.data).toBe('test');
    expect(reactiveResult.isIdle).toBe(true);
  });

  it('USAGE: with params', async () => {
    const { idiomaticEagerAsync, idiomaticFn, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    // Test idiomatic interface - call with params
    await expect(chimericEagerAsync({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with params
    const reactiveResult = chimericEagerAsync.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResult.data).toBe('Hello John');
    expect(reactiveResult.isSuccess).toBe(true);
  });

  it('USAGE: optional params', async () => {
    const { idiomaticEagerAsync, idiomaticFn, reactiveEagerAsync, reactiveFn } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    // Test idiomatic interface - call with params
    await expect(chimericEagerAsync({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call without params
    await expect(chimericEagerAsync()).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test idiomatic interface - call with undefined
    await expect(chimericEagerAsync(undefined)).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith(undefined);
    expect(idiomaticFn).toHaveBeenCalledTimes(3);

    // Test reactive interface - use without params
    const reactiveResultWithoutParams = chimericEagerAsync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResultWithoutParams.data).toBe('Hello');

    // Test reactive interface - use with undefined
    const reactiveResultWithUndefined = chimericEagerAsync.use(undefined);
    expect(reactiveFn).toHaveBeenCalledWith(undefined);
    expect(reactiveFn).toHaveBeenCalledTimes(2);
    expect(reactiveResultWithUndefined.data).toBe('Hello');

    // Test reactive interface - use with params
    const reactiveResultWithParams = chimericEagerAsync.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(3);
    expect(reactiveResultWithParams.data).toBe('Hello John');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericEagerAsync({ name: 'John' });

      const result = chimericEagerAsync.use();
      // @ts-expect-error testing invalid call
      result.data.nonExistent();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericEagerAsync();

      // @ts-expect-error testing invalid call
      chimericEagerAsync.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericEagerAsync(1);

      // @ts-expect-error testing invalid call
      chimericEagerAsync.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const {
      idiomaticEagerAsync,
      reactiveEagerAsync,
      annotation: _annotation,
    } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericEagerAsync: TestAnnotation = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    expect(chimericEagerAsync).toBeDefined();
  });

  it('ANNOTATION: with params', async () => {
    const {
      idiomaticEagerAsync,
      reactiveEagerAsync,
      annotation: _annotation,
    } = EagerAsyncTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericEagerAsync: TestAnnotation = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    expect(chimericEagerAsync).toBeDefined();
  });

  it('ANNOTATION: optional params', async () => {
    const {
      idiomaticEagerAsync,
      reactiveEagerAsync,
      annotation: _annotation,
    } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericEagerAsync: TestAnnotation = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    expect(chimericEagerAsync).toBeDefined();
  });
});
