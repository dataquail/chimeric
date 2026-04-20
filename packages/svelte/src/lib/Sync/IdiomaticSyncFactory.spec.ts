import { IdiomaticSyncFactory } from './IdiomaticSyncFactory';
import { SyncTestFixtures } from '../__tests__/syncFixtures.svelte';

describe('IdiomaticSyncFactory', () => {
  it('USAGE: returns result for no-param fn', () => {
    const { fn } = SyncTestFixtures.withoutParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    expect(idiomatic()).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: returns result for param fn', () => {
    const { fn } = SyncTestFixtures.withParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    expect(idiomatic({ name: 'John' })).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: returns result for optional-param fn (without params)', () => {
    const { fn } = SyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    expect(idiomatic()).toBe('Hello');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: returns result for optional-param fn (with params)', () => {
    const { fn } = SyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    expect(idiomatic({ name: 'Jane' })).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('TYPE ERRORS: no params', () => {
    const { fn } = SyncTestFixtures.withoutParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    try {
      // @ts-expect-error - no params expected
      idiomatic({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { fn } = SyncTestFixtures.withParams.getIdiomatic();
    const idiomatic = IdiomaticSyncFactory(fn);
    try {
      // @ts-expect-error - params required
      idiomatic();
      // @ts-expect-error - wrong param shape
      idiomatic({ wrong: 'param' });
    } catch {
      // Expected error
    }
  });

  it('ANNOTATIONS: no params', () => {
    const { annotation: _annotation, fn } =
      SyncTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const idiomatic: TestAnnotation = IdiomaticSyncFactory(fn);
    expect(idiomatic).toBeDefined();
  });

  it('ANNOTATIONS: with params', () => {
    const { annotation: _annotation, fn } =
      SyncTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const idiomatic: TestAnnotation = IdiomaticSyncFactory(fn);
    expect(idiomatic).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', () => {
    const { annotation: _annotation, fn } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const idiomatic: TestAnnotation = IdiomaticSyncFactory(fn);
    expect(idiomatic).toBeDefined();
  });
});
