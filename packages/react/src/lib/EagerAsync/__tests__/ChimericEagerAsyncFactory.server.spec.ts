import { ChimericEagerAsyncFactory } from '../ChimericEagerAsyncFactory.server';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('ChimericEagerAsyncFactoryServer', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await chimericEagerAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await chimericEagerAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const result1 = await chimericEagerAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const result2 = await chimericEagerAsync({ name: 'Jane' }, undefined);
    expect(result2).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('USAGE: IDIOMATIC: retry option', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const chimericEagerAsync = ChimericEagerAsyncFactory({
      eagerAsyncFn: mockPromise,
    });

    try {
      await chimericEagerAsync({ retry: 3 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  // SERVER ERRORS: useHook
  it('SERVER ERRORS: useHook throws', () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    expect(() => chimericEagerAsync.useHook()).toThrow(
      "@chimeric/react: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync();

      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ wrong: 'param' });

      await chimericEagerAsync();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
