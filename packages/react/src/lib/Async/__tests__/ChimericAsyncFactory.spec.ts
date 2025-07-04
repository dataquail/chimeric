import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericAsyncFactory } from '../ChimericAsyncFactory';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  ChimericAsyncWithoutParamsReturnsString,
  ChimericAsyncWithParamsReturnsString,
} from '../../__tests__/asyncFixtures';

describe('ChimericAsyncFactory', () => {
  it('should invoke the reactive hook', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const chimericAsync = ChimericAsyncFactory(mockPromise);

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
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const chimericAsync = ChimericAsyncFactory(mockPromise);
    const result = await chimericAsync();

    expect(result).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const mockPromise = makeAsyncFnWithParamsReturnsString();
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
    const mockPromise = makeAsyncFnWithParamsReturnsString();
    const chimericAsync = ChimericAsyncFactory(mockPromise);
    const result = await chimericAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should retry the fn', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const chimericAsync = ChimericAsyncFactory(mockPromise);
    try {
      await chimericAsync({ options: { retry: 3 } });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });

  it('should handle type annotations with no params', async () => {
    const chimericAsync: ChimericAsyncWithoutParamsReturnsString =
      ChimericAsyncFactory(makeAsyncFnWithoutParamsReturnsString());
    const result = await chimericAsync();

    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const chimericAsync: ChimericAsyncWithParamsReturnsString =
      ChimericAsyncFactory(makeAsyncFnWithParamsReturnsString());
    const result = await chimericAsync({ name: 'John' });

    expect(result).toBe('Hello John');
  });
});
