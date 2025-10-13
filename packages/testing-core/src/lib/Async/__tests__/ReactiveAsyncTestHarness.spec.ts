import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';
import { ReactiveAsyncTestHarness } from '../ReactiveAsyncTestHarness';

describe('ReactiveAsyncTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { reactiveAsync, invokeFn } =
      AsyncTestFixtures.withoutParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    const result = await harness.result.current.invoke();

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { reactiveAsync, invokeFn } =
      AsyncTestFixtures.withParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    const result = await harness.result.current.invoke({ name: 'John' });

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledTimes(1);
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('USAGE: with optional params', async () => {
    const { reactiveAsync, invokeFn } =
      AsyncTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    const result1 = await harness.result.current.invoke();

    expect(reactiveAsync.use).toHaveBeenCalled();
    expect(invokeFn).toHaveBeenCalledWith();
    expect(result1).toBe('Hello');

    const result2 = await harness.result.current.invoke({ name: 'Jane' });

    expect(invokeFn).toHaveBeenCalledTimes(2);
    expect(invokeFn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveAsync } =
      AsyncTestFixtures.withoutParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    try {
      // @ts-expect-error - should error because params are not expected
      harness.result.current.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveAsync } = AsyncTestFixtures.withParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    try {
      // @ts-expect-error - should error because params are expected
      harness.result.current.invoke();

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveAsync } =
      AsyncTestFixtures.withOptionalParams.getReactive();

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync,
    });

    try {
      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke({ wrong: 'param' });

      // @ts-expect-error - should error because wrong params
      harness.result.current.invoke(1);

      harness.result.current.invoke();
    } catch {
      // Expected errors
    }
  });
});
