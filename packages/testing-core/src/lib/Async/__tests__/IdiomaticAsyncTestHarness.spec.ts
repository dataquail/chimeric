import { IdiomaticAsyncTestHarness } from '../IdiomaticAsyncTestHarness';
import { createIdiomaticAsync } from '@chimeric/core';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('IdiomaticAsyncTestHarness', () => {
  it('should wait for success', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const promise = IdiomaticAsyncTestHarness({
      idiomaticAsync: createIdiomaticAsync(mockPromise),
    });

    expect(promise.result.current.isIdle).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    promise.result.current.call();

    expect(promise.result.current.isIdle).toBe(false);
    expect(promise.result.current.isPending).toBe(true);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    await promise.waitFor(() =>
      expect(promise.result.current.isSuccess).toBe(true),
    );

    expect(promise.result.current.isSuccess).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should take options', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const promise = IdiomaticAsyncTestHarness({
      idiomaticAsync: createIdiomaticAsync(mockPromise),
      idiomaticOptions: { retry: 3 },
    });

    expect(promise.result.current.isIdle).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    promise.result.current.call();

    expect(promise.result.current.isIdle).toBe(false);
    expect(promise.result.current.isPending).toBe(true);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);

    await promise.waitFor(() =>
      expect(promise.result.current.isSuccess).toBe(true),
    );

    expect(promise.result.current.isSuccess).toBe(true);
    expect(promise.result.current.isPending).toBe(false);
    expect(promise.result.current.isError).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith({ options: { retry: 3 } });
  });

  it('should take options with params', async () => {
    const mockPromise = makeAsyncFnWithParamsReturnsString();
    const promise = IdiomaticAsyncTestHarness({
      idiomaticAsync: createIdiomaticAsync(mockPromise),
      idiomaticOptions: { retry: 3 },
    });

    promise.result.current.call({ name: 'John' });

    expect(promise.result.current.isIdle).toBe(false);
    expect(promise.result.current.isPending).toBe(true);
    expect(promise.result.current.isSuccess).toBe(false);
    expect(promise.result.current.error).toBe(null);
    expect(promise.result.current.data).toBe(undefined);
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith({
      name: 'John',
      options: { retry: 3 },
    });
  });
});
