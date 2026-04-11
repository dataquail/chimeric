import { IdiomaticEagerAsyncFactory } from '../IdiomaticEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('IdiomaticEagerAsyncFactory', () => {
  it('USAGE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await idiomaticEagerAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await idiomaticEagerAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
    const idiomaticEagerAsync = IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn });

    const result1 = await idiomaticEagerAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const result2 = await idiomaticEagerAsync({ name: 'Jane' }, undefined);
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
});
