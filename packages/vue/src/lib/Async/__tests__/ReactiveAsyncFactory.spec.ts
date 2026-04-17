import { ReactiveAsyncFactory } from '../ReactiveAsyncFactory';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';
import { withSetup, flushPromises } from '../../__tests__/testUtils';

describe('ReactiveAsyncFactory', () => {
  it('USAGE: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = withSetup(() => reactiveAsync.useHook());

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    const invokePromise = result.invoke();
    await flushPromises();
    await invokePromise;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = withSetup(() => reactiveAsync.useHook());

    expect(result.isIdle.value).toBe(true);

    const invokePromise = result.invoke({ name: 'John' });
    await flushPromises();
    await invokePromise;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = withSetup(() => reactiveAsync.useHook());

    const invokePromise1 = result.invoke();
    await flushPromises();
    await invokePromise1;

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const invokePromise2 = result.invoke({ name: 'Jane' }, undefined);
    await flushPromises();
    await invokePromise2;

    expect(result.data.value).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = withSetup(() => reactiveAsync.useHook());

    try {
      // @ts-expect-error - Testing type error
      await result.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = withSetup(() => reactiveAsync.useHook());

    try {
      // @ts-expect-error - Testing type error
      await result.invoke();

      // @ts-expect-error - Testing type error
      await result.invoke({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });
});
