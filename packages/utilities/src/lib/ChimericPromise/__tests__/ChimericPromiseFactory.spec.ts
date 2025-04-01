import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericPromiseFactory } from '../ChimericPromiseFactory';

describe('ChimericPromiseFactory', () => {
  it('should invoke the reactive hook', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const chimericPromise = ChimericPromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(chimericPromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const chimericPromise = ChimericPromiseFactory({ promiseFn: mockPromise });
    const result = await chimericPromise();

    expect(result).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericPromise = ChimericPromiseFactory({ promiseFn: mockPromise });
    const { result } = renderHook(chimericPromise.usePromise);

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke the idiomatic fn with params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericPromise = ChimericPromiseFactory({ promiseFn: mockPromise });
    const result = await chimericPromise({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });
});
