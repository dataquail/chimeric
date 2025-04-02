import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactivePromiseFactory } from '../ReactivePromiseFactory';

describe('ReactivePromiseFactory', () => {
  it('should invoke the reactive hook', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(reactivePromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with object params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(reactivePromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the reactive hook with non-object params', async () => {
    const mockPromise = vi.fn((name: string) =>
      Promise.resolve(`Hello ${name}`),
    );
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(reactivePromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call('John'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith('John');
  });

  it('should not invoke the reactive hook if invokeOnMount is false', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(reactivePromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(mockPromise).not.toHaveBeenCalled();

    await act(async () => result.current.call());

    expect(result.current.isSuccess).toBe(true);
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook if invokeOnMount is true with object params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(() =>
      reactivePromise.usePromise({ name: 'John' }, { invokeOnMount: true }),
    );

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isPending).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should invoke the reactive hook if invokeOnMount is true with non-object params', async () => {
    const mockPromise = vi.fn((name: string) =>
      Promise.resolve(`Hello ${name}`),
    );
    const reactivePromise = ReactivePromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(() =>
      reactivePromise.usePromise('John', { invokeOnMount: true }),
    );

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isPending).toBe(false);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });
});
