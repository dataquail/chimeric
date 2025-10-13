/* eslint-disable @typescript-eslint/no-explicit-any */
import { fuseChimericAsync } from './fuseChimericAsync';
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';

describe('fuseChimericAsync', () => {
  // USAGE TESTS
  it('USAGE: no params', async () => {
    const {
      idiomaticAsync,
      idiomaticFn,
      reactiveAsync,
      reactiveFn,
      invokeFn,
    } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    // Test idiomatic interface
    await expect(chimericAsync()).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use()
    const reactiveResult = chimericAsync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResult.data).toBe('test');

    // Test reactive interface - invoke()
    await expect(reactiveResult.invoke()).resolves.toBe('test');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const {
      idiomaticAsync,
      idiomaticFn,
      reactiveAsync,
      reactiveFn,
      invokeFn,
    } = AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    // Test idiomatic interface
    await expect(chimericAsync({ name: 'John' })).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use()
    const reactiveResult = chimericAsync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - invoke()
    await expect(reactiveResult.invoke({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: optional params', async () => {
    const {
      idiomaticAsync,
      idiomaticFn,
      reactiveAsync,
      reactiveFn,
      invokeFn,
    } = AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    // Test idiomatic interface - with params
    await expect(chimericAsync({ name: 'John' })).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - without params
    await expect(chimericAsync()).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use()
    const reactiveResult = chimericAsync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - invoke() with params
    await expect(reactiveResult.invoke({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - invoke() without params
    await expect(reactiveResult.invoke()).resolves.toBe('Hello');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(2);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericAsync({ name: 'John' });

      const result = chimericAsync.use();
      // @ts-expect-error testing invalid call
      await result.invoke({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericAsync();

      const result = chimericAsync.use();
      // @ts-expect-error testing invalid call
      await result.invoke();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticAsync, reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericAsync(1);

      const result = chimericAsync.use();
      // @ts-expect-error testing invalid call
      await result.invoke(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticAsync, reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericAsync;
    expect(testAnnotation).toBe(chimericAsync);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticAsync, reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericAsync;
    expect(testAnnotation).toBe(chimericAsync);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticAsync, reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = fuseChimericAsync({
      idiomatic: idiomaticAsync,
      reactive: reactiveAsync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericAsync;
    expect(testAnnotation).toBe(chimericAsync);
  });
});
