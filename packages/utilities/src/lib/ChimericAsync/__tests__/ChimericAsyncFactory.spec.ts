import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericAsyncFactory } from '../ChimericAsyncFactory';
import { DefineChimericAsync } from '@chimeric/core';

describe('ChimericAsyncFactory', () => {
  it('should invoke the reactive hook', async () => {
    type TestChimericAsync = DefineChimericAsync<() => Promise<string>>;
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const chimericAsync: TestChimericAsync = ChimericAsyncFactory(mockPromise);

    const { result } = renderHook(chimericAsync.useAsync);

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
    const chimericAsync = ChimericAsyncFactory(mockPromise);
    const result = await chimericAsync();

    expect(result).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericAsync = ChimericAsyncFactory(mockPromise);
    const { result } = renderHook(chimericAsync.useAsync);

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
    type TestChimericAsync = DefineChimericAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericAsync: TestChimericAsync = ChimericAsyncFactory(mockPromise);
    const result = await chimericAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });
});
