/* eslint-disable @typescript-eslint/no-explicit-any */
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { createReactiveEagerAsync } from './createReactiveEagerAsync';

describe('createReactiveEagerAsync', () => {
  it('should create a reactive eager async function', () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();
    const reactiveEagerAsync = createReactiveEagerAsync(fn);

    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('use');
    expect(typeof reactiveEagerAsync.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveEagerAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive eager async');
  });

  // USAGE TESTS
  it('USAGE: no params', () => {
    const { fn, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveEagerAsync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.data).toBe('test');
  });

  it('USAGE: with params', () => {
    const { fn, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveEagerAsync.use({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.data).toBe('Hello John');
  });

  it('USAGE: optional params', () => {
    const { fn, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() with params
    const resultWithParams = reactiveEagerAsync.use({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParams.data).toBe('Hello John');

    // Usage implementation test - use() without params
    const resultWithoutParams = reactiveEagerAsync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithoutParams.data).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveEagerAsync.use({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveEagerAsync.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', () => {
    const { reactiveEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveEagerAsync.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', () => {
    const { reactiveEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveEagerAsync;
    expect(testAnnotation).toBe(reactiveEagerAsync);
  });

  it('ANNOTATION: with params', () => {
    const { reactiveEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveEagerAsync;
    expect(testAnnotation).toBe(reactiveEagerAsync);
  });

  it('ANNOTATION: optional params', () => {
    const { reactiveEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveEagerAsync;
    expect(testAnnotation).toBe(reactiveEagerAsync);
  });
});
