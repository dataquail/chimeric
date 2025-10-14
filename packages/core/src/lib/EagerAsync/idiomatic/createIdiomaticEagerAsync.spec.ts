/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticEagerAsync } from './createIdiomaticEagerAsync';
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';

describe('createIdiomaticEagerAsync', () => {
  it('should create an idiomatic eager async function', () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticEagerAsync = createIdiomaticEagerAsync(fn);
    expect(typeof idiomaticEagerAsync).toBe('function');
    expect(idiomaticEagerAsync).toBe(fn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticEagerAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic eager async');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    // Usage implementation test
    const result = await idiomaticEagerAsync();
    expect(idiomaticEagerAsync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const result = await idiomaticEagerAsync({ name: 'John' });
    expect(idiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello John');
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParams = await idiomaticEagerAsync({ name: 'John' });
    expect(idiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParams).toBe('Hello John');

    const resultWithoutParams = await idiomaticEagerAsync();
    expect(idiomaticEagerAsync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticEagerAsync({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticEagerAsync();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticEagerAsync } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticEagerAsync(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticEagerAsync;
    expect(testAnnotation).toBe(idiomaticEagerAsync);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticEagerAsync;
    expect(testAnnotation).toBe(idiomaticEagerAsync);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticEagerAsync;
    expect(testAnnotation).toBe(idiomaticEagerAsync);
  });
});
