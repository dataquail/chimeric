import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveAsyncFactory } from '../ReactiveAsyncFactory';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';

describe('ReactiveAsyncFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(reactiveAsync.use);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(() => reactiveAsync.use());

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(() => reactiveAsync.use());

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    await act(async () => result.current.invoke({ name: 'Jane' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello Jane');
  });

  it('USAGE: retry option', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);
    const { result } = renderHook(() => reactiveAsync.use({ retry: 3 }));

    expect(result.current.isIdle).toBe(true);

    let caughtError;
    try {
      await act(async () => {
        await result.current.invoke();
      });
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeInstanceOf(Error);
    expect((caughtError as Error).message).toBe('test');

    // The state should now be in error state
    expect(result.current.isError).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(() => reactiveAsync.use());

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ name: 'John' }));
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = AsyncTestFixtures.withParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(() => reactiveAsync.use());

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke());

      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ wrong: 'param' }));
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveAsync = ReactiveAsyncFactory(fn);
    const { result } = renderHook(() => reactiveAsync.use());

    try {
      // @ts-expect-error - Testing type error
      await act(async () => result.current.invoke({ wrong: 'param' }));

      await act(async () => result.current.invoke());
    } catch {
      // Expected error
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

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      AsyncTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveAsyncFactory(fn);
    expect(testAnnotation).toBeDefined();
  });
});
