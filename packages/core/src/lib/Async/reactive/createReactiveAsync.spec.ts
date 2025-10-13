/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';
import { createReactiveAsync } from './createReactiveAsync';

describe('createReactiveAsync', () => {
  it('should create a reactive async function', () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();
    const reactiveAsync = createReactiveAsync(fn);

    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('use');
    expect(typeof reactiveAsync.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive async');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, invokeFn, reactiveAsync } =
      AsyncTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveAsync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    // Usage implementation test - invoke() calls
    await expect(result.invoke()).resolves.toBe('test');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const { fn, invokeFn, reactiveAsync } =
      AsyncTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveAsync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    // Usage implementation test - invoke() calls
    await expect(result.invoke({ name: 'John' })).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: optional params', async () => {
    const { fn, invokeFn, reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveAsync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    // Usage implementation test - invoke() with params
    await expect(result.invoke({ name: 'John' })).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    // Usage implementation test - invoke() without params
    await expect(result.invoke()).resolves.toBe('Hello');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(2);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { reactiveAsync } =
      AsyncTestFixtures.withoutParams.getReactive();

    const result = reactiveAsync.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { reactiveAsync } =
      AsyncTestFixtures.withParams.getReactive();

    const result = reactiveAsync.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getReactive();

    const result = reactiveAsync.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveAsync;
    expect(testAnnotation).toBe(reactiveAsync);
  });

  it('ANNOTATION: with params', async () => {
    const { reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveAsync;
    expect(testAnnotation).toBe(reactiveAsync);
  });

  it('ANNOTATION: optional params', async () => {
    const { reactiveAsync, annotation: _annotation } =
      AsyncTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveAsync;
    expect(testAnnotation).toBe(reactiveAsync);
  });
});
