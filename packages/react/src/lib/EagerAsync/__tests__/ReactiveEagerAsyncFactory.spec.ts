import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveEagerAsyncFactory } from '../ReactiveEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('ReactiveEagerAsyncFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = renderHook(reactiveEagerAsync.use);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = renderHook(() => reactiveEagerAsync.use({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    const { result } = renderHook(() => reactiveEagerAsync.use());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const { result: result2 } = renderHook(() =>
      reactiveEagerAsync.use({ name: 'Jane' }),
    );

    await waitFor(() => {
      expect(result2.current.isSuccess).toBe(true);
    });

    expect(result2.current.data).toBe('Hello Jane');
  });

  it('USAGE: error handling', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: mockPromise });
    const { result } = renderHook(() => reactiveEagerAsync.use());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveEagerAsync.use({ name: 'John' }));
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveEagerAsync.use());

      // @ts-expect-error - Testing type error
      renderHook(() => reactiveEagerAsync.use({ wrong: 'param' }));
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getReactive();
    const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      renderHook(() => reactiveEagerAsync.use({ wrong: 'param' }));

      renderHook(() => reactiveEagerAsync.use());
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
    expect(testAnnotation).toBeDefined();
  });
});
