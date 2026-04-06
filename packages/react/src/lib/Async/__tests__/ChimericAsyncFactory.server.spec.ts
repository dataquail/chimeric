import { ChimericAsyncFactory } from '../ChimericAsyncFactory.server';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';

describe('ChimericAsyncFactoryServer', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const result = await chimericAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const result = await chimericAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);

    const result1 = await chimericAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const result2 = await chimericAsync({ name: 'Jane' }, undefined);
    expect(result2).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('USAGE: IDIOMATIC: retry option', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const chimericAsync = ChimericAsyncFactory(mockPromise);

    try {
      await chimericAsync({ retry: 3 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  // SERVER ERRORS: useHook
  it('SERVER ERRORS: useHook throws', () => {
    const { fn } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);

    expect(() => chimericAsync.useHook()).toThrow(
      "@chimeric/react: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await chimericAsync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await chimericAsync();

      // @ts-expect-error - Testing type error
      await chimericAsync({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await chimericAsync({ wrong: 'param' });

      await chimericAsync();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });
});
