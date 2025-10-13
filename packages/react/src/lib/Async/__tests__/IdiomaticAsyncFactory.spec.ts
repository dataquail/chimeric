import { IdiomaticAsyncFactory } from '../IdiomaticAsyncFactory';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';

describe('IdiomaticAsyncFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);
    const result = await idiomaticAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);
    const result = await idiomaticAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);

    const result1 = await idiomaticAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalledWith(undefined);

    const result2 = await idiomaticAsync({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('USAGE: retry option', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const idiomaticAsync = IdiomaticAsyncFactory(mockPromise);

    try {
      await idiomaticAsync({ retry: 3 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await idiomaticAsync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await idiomaticAsync();

      // @ts-expect-error - Testing type error
      await idiomaticAsync({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomaticAsync = IdiomaticAsyncFactory(fn);

    try {
      // @ts-expect-error - Testing type error
      await idiomaticAsync({ wrong: 'param' });

      await idiomaticAsync();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });
});
