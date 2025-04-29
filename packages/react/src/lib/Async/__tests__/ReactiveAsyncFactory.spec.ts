import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveAsyncFactory } from '../ReactiveAsyncFactory';

describe('ReactiveAsyncFactory', () => {
  it('should invoke the reactive hook', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);
    const { result } = renderHook(reactiveAsync.useAsync);

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
    const reactiveAsync = ReactiveAsyncFactory(mockPromise);
    const { result } = renderHook(reactiveAsync.useAsync);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });
});
