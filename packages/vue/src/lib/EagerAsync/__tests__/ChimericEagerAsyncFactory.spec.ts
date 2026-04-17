import { ChimericEagerAsyncFactory } from '../ChimericEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';
import { withSetup, flushPromises } from '../../__tests__/testUtils';

describe('ChimericEagerAsyncFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() => chimericEagerAsync.useHook());

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() =>
      chimericEagerAsync.useHook({ name: 'John' }),
    );

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() => chimericEagerAsync.useHook());

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const { result: result2 } = withSetup(() =>
      chimericEagerAsync.useHook({ name: 'Jane' }, undefined),
    );

    await flushPromises();

    expect(result2.isSuccess.value).toBe(true);
    expect(result2.data.value).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

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

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      withSetup(() => chimericEagerAsync.useHook({ name: 'John' }));
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      withSetup(() => chimericEagerAsync.useHook());

      // @ts-expect-error - Testing type error
      withSetup(() => chimericEagerAsync.useHook({ wrong: 'param' }));
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      withSetup(() => chimericEagerAsync.useHook({ wrong: 'param' }));

      withSetup(() => chimericEagerAsync.useHook());
    } catch {
      // Expected error
    }
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
