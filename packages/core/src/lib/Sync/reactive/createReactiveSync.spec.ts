/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncTestFixtures } from '../__tests__/syncFixtures';
import { createReactiveSync } from './createReactiveSync';

describe('createReactiveSync', () => {
  it('should create a reactive sync function', () => {
    const { fn } = SyncTestFixtures.withoutParams.getReactive();
    const reactiveSync = createReactiveSync(fn);

    expect(typeof reactiveSync).toBe('object');
    expect(reactiveSync).toHaveProperty('use');
    expect(typeof reactiveSync.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveSync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive sync');
  });

  // USAGE TESTS
  it('USAGE: no params', () => {
    const { fn, reactiveSync } =
      SyncTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveSync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
  });

  it('USAGE: with params', () => {
    const { fn, reactiveSync } =
      SyncTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const result = reactiveSync.use({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello John');
  });

  it('USAGE: optional params', () => {
    const { fn, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls with params
    const resultWithParams = reactiveSync.use({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParams).toBe('Hello John');

    // Usage implementation test - use() calls without params
    const resultWithoutParams = reactiveSync.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', () => {
    const { reactiveSync } =
      SyncTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveSync.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveSync } =
      SyncTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveSync.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', () => {
    const { reactiveSync } =
      SyncTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveSync.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', () => {
    const { reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveSync;
    expect(testAnnotation).toBe(reactiveSync);
  });

  it('ANNOTATION: with params', () => {
    const { reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveSync;
    expect(testAnnotation).toBe(reactiveSync);
  });

  it('ANNOTATION: optional params', () => {
    const { reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveSync;
    expect(testAnnotation).toBe(reactiveSync);
  });
});
