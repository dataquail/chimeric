import { ReactiveEagerAsyncFactory } from '../ReactiveEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';
import { withSetup, flushPromises } from '../../__tests__/testUtils';

describe('ReactiveEagerAsyncFactory', () => {
  it('USAGE: no params - auto-executes on mount', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() => reactiveEagerAsync.useHook());

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params - auto-executes on mount with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() =>
      reactiveEagerAsync.useHook({ name: 'John' }),
    );

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params - auto-executes on mount', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() => reactiveEagerAsync.useHook());

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with optional params and values', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = withSetup(() =>
      reactiveEagerAsync.useHook({ name: 'Jane' }, undefined),
    );

    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      withSetup(() => reactiveEagerAsync.useHook({ name: 'John' }));
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      withSetup(() => reactiveEagerAsync.useHook());

      // @ts-expect-error - Testing type error
      withSetup(() => reactiveEagerAsync.useHook({ wrong: 'param' }));
    } catch {
      // Expected errors
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
