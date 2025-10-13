/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticAsync } from './createIdiomaticAsync';
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';

describe('createIdiomaticAsync', () => {
  it('should create an idiomatic async function', () => {
    const { fn } = AsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticAsync = createIdiomaticAsync(fn);
    expect(typeof idiomaticAsync).toBe('function');
    expect(idiomaticAsync).toBe(fn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic async');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, idiomaticAsync } =
      AsyncTestFixtures.withoutParams.getIdiomatic();
    // Usage implementation test
    const result = await idiomaticAsync();
    expect(idiomaticAsync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticAsync } =
      AsyncTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const result = await idiomaticAsync({ name: 'John' });
    expect(idiomaticAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello John');
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticAsync } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParams = await idiomaticAsync({ name: 'John' });
    expect(idiomaticAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParams).toBe('Hello John');

    const resultWithoutParams = await idiomaticAsync();
    expect(idiomaticAsync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticAsync({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticAsync();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticAsync } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticAsync(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticAsync, annotation: _annotation } =
      AsyncTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticAsync;
    expect(testAnnotation).toBe(idiomaticAsync);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticAsync, annotation: _annotation } =
      AsyncTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticAsync;
    expect(testAnnotation).toBe(idiomaticAsync);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticAsync, annotation: _annotation } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticAsync;
    expect(testAnnotation).toBe(idiomaticAsync);
  });
});
