import { ChimericAsyncFactory } from '../ChimericAsyncFactory';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';
import { withSetup, flushPromises } from '../../__tests__/testUtils';

describe('ChimericAsyncFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    const invokePromise = result.invoke();
    await flushPromises();
    await invokePromise;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    const invokePromise = result.invoke({ name: 'John' });
    await flushPromises();
    await invokePromise;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    const invokePromise1 = result.invoke();
    await flushPromises();
    await invokePromise1;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const invokePromise2 = result.invoke({ name: 'Jane' }, undefined);
    await flushPromises();
    await invokePromise2;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

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

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    try {
      // @ts-expect-error - Testing type error
      await result.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    try {
      // @ts-expect-error - Testing type error
      await result.invoke();

      // @ts-expect-error - Testing type error
      await result.invoke({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericAsync = ChimericAsyncFactory(fn);
    const { result } = withSetup(() => chimericAsync.useHook());

    try {
      // @ts-expect-error - Testing type error
      await result.invoke({ wrong: 'param' });

      await result.invoke();
    } catch {
      // Expected error
    }
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
