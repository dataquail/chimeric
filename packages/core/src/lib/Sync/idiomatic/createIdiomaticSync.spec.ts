/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticSync } from './createIdiomaticSync';
import { SyncTestFixtures } from '../__tests__/syncFixtures';

describe('createIdiomaticSync', () => {
  it('should create an idiomatic sync function', () => {
    const { fn } = SyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticSync = createIdiomaticSync(fn);
    expect(typeof idiomaticSync).toBe('function');
    expect(idiomaticSync).toBe(fn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticSync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic sync');
  });

  // USAGE TESTS
  it('USAGE: no params', () => {
    const { fn, idiomaticSync } =
      SyncTestFixtures.withoutParams.getIdiomatic();
    // Usage implementation test
    const result = idiomaticSync();
    expect(idiomaticSync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
  });

  it('USAGE: with params', () => {
    const { fn, idiomaticSync } =
      SyncTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const result = idiomaticSync({ name: 'John' });
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello John');
  });

  it('USAGE: optional params', () => {
    const { fn, idiomaticSync } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParams = idiomaticSync({ name: 'John' });
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParams).toBe('Hello John');

    const resultWithoutParams = idiomaticSync();
    expect(idiomaticSync).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithoutParams).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticSync } =
      SyncTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      idiomaticSync({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticSync } =
      SyncTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      idiomaticSync();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', () => {
    const { idiomaticSync } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      idiomaticSync(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', () => {
    const { idiomaticSync, annotation: _annotation } =
      SyncTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticSync;
    expect(testAnnotation).toBe(idiomaticSync);
  });

  it('ANNOTATION: with params', () => {
    const { idiomaticSync, annotation: _annotation } =
      SyncTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticSync;
    expect(testAnnotation).toBe(idiomaticSync);
  });

  it('ANNOTATION: optional params', () => {
    const { idiomaticSync, annotation: _annotation } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticSync;
    expect(testAnnotation).toBe(idiomaticSync);
  });
});
