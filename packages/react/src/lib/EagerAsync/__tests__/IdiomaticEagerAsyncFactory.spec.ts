import { IdiomaticEagerAsyncFactory } from '../IdiomaticEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('IdiomaticEagerAsyncFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    const result = await idiomaticEagerAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    const result = await idiomaticEagerAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });

    const result1 = await idiomaticEagerAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalledWith(undefined);

    const result2 = await idiomaticEagerAsync({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('USAGE: retry option', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: mockPromise,
    });

    try {
      await idiomaticEagerAsync({ retry: 3 });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticEagerAsync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticEagerAsync();

      // @ts-expect-error - Testing type error
      await idiomaticEagerAsync({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticEagerAsync({ wrong: 'param' });

      await idiomaticEagerAsync();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
