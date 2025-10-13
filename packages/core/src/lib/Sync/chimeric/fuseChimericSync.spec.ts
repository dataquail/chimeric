/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncTestFixtures } from '../__tests__/syncFixtures';
import { fuseChimericSync } from './fuseChimericSync';

describe('fuseChimericSync', () => {
  // USAGE TESTS
  it('USAGE: no params', () => {
    const {
      idiomaticSync,
      idiomaticFn,
      reactiveSync,
      reactiveFn,
    } = SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    // Test idiomatic interface - call
    expect(chimericSync()).toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use
    const reactiveResult = chimericSync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResult).toBe('test');
  });

  it('USAGE: with params', () => {
    const {
      idiomaticSync,
      idiomaticFn,
      reactiveSync,
      reactiveFn,
    } = SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    // Test idiomatic interface - call
    expect(chimericSync({ name: 'John' })).toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use
    const reactiveResult = chimericSync.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResult).toBe('Hello John');
  });

  it('USAGE: optional params', () => {
    const {
      idiomaticSync,
      idiomaticFn,
      reactiveSync,
      reactiveFn,
    } = SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    // Test idiomatic interface - call with params
    expect(chimericSync({ name: 'John' })).toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call without params
    expect(chimericSync()).toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use with params
    const reactiveResultWithParams = chimericSync.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResultWithParams).toBe('Hello John');

    // Test reactive interface - use without params
    const reactiveResultWithoutParams = chimericSync.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(2);
    expect(reactiveResultWithoutParams).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error testing invalid call
      chimericSync({ name: 'John' });

      // @ts-expect-error testing invalid call
      chimericSync.use({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error testing invalid call
      chimericSync();

      // @ts-expect-error testing invalid call
      chimericSync.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error testing invalid call
      chimericSync(1);

      // @ts-expect-error testing invalid call
      chimericSync.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', () => {
    const { idiomaticSync, reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericSync;
    expect(testAnnotation).toBe(chimericSync);
  });

  it('ANNOTATION: with params', () => {
    const { idiomaticSync, reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericSync;
    expect(testAnnotation).toBe(chimericSync);
  });

  it('ANNOTATION: optional params', () => {
    const { idiomaticSync, reactiveSync, annotation: _annotation } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericSync;
    expect(testAnnotation).toBe(chimericSync);
  });
});
