import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { IdiomaticEagerAsyncTestHarness } from '../IdiomaticEagerAsyncTestHarness';
import { createIdiomaticAsync } from '@chimeric/core';

describe('IdiomaticEagerAsyncTestHarness', () => {
  it('should wait for success', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: createIdiomaticAsync(mockPromise),
    });

    expect(asyncRead.result.current.isIdle).toBe(false);
    expect(asyncRead.result.current.isPending).toBe(true);
    expect(asyncRead.result.current.isSuccess).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe(undefined);

    await asyncRead.waitFor(() =>
      expect(asyncRead.result.current.isSuccess).toBe(true),
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    const mockPromise = makeAsyncFnWithoutParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: createIdiomaticAsync(mockPromise),
    });

    expect(asyncRead.result.current.isIdle).toBe(false);
    expect(asyncRead.result.current.isPending).toBe(true);
    expect(asyncRead.result.current.isSuccess).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe(undefined);

    await asyncRead.waitFor(() =>
      expect(asyncRead.result.current.isSuccess).toBe(true),
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);

    await asyncRead.waitFor(
      () => expect(asyncRead.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(2);
  });

  it('should handle params', async () => {
    const mockPromise = makeAsyncFnWithParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: createIdiomaticAsync(mockPromise),
      params: { name: 'John' },
    });

    expect(asyncRead.result.current.isIdle).toBe(false);
    expect(asyncRead.result.current.isPending).toBe(true);
    expect(asyncRead.result.current.isSuccess).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe(undefined);

    await asyncRead.waitFor(() =>
      expect(asyncRead.result.current.isSuccess).toBe(true),
    );

    expect(asyncRead.result.current.isSuccess).toBe(true);
    expect(asyncRead.result.current.isPending).toBe(false);
    expect(asyncRead.result.current.isError).toBe(false);
    expect(asyncRead.result.current.error).toBe(null);
    expect(asyncRead.result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
  });
});
