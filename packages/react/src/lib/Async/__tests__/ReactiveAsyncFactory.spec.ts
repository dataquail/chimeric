import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveAsyncFactory } from '../ReactiveAsyncFactory';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  ReactiveAsyncWithoutParamsReturnsString,
  ReactiveAsyncWithParamsReturnsString,
} from '../../__tests__/asyncFixtures';

describe('ReactiveAsyncFactory', () => {
  it('should invoke the reactive hook', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);
    const { result } = renderHook(reactiveAsync.useAsync);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with object params', async () => {
    const mockPromise = makeAsyncFnWithParamsReturnsString();
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);
    const { result } = renderHook(reactiveAsync.useAsync);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations with no params', async () => {
    const reactiveAsync: ReactiveAsyncWithoutParamsReturnsString =
      ReactiveAsyncFactory(makeAsyncFnWithoutParamsReturnsString());
    const { result } = renderHook(reactiveAsync.useAsync);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const reactiveAsync: ReactiveAsyncWithParamsReturnsString =
      ReactiveAsyncFactory(makeAsyncFnWithParamsReturnsString());
    const { result } = renderHook(reactiveAsync.useAsync);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.invoke({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
  });

  it('should retry the fn with hook', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);

    const { result } = renderHook(() => reactiveAsync.useAsync({ retry: 3 }));

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
});
