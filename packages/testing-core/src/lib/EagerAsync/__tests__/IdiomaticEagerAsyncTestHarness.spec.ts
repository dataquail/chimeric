import {
  makeIdiomaticEagerAsyncWithoutParamsReturnsString,
  makeIdiomaticEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';
import { IdiomaticEagerAsyncTestHarness } from '../IdiomaticEagerAsyncTestHarness';

describe('IdiomaticEagerAsyncTestHarness', () => {
  it('should wait for success', async () => {
    const mockPromise = makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: mockPromise,
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
    const mockPromise = makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: mockPromise,
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
    const mockPromise = makeIdiomaticEagerAsyncWithParamsReturnsString();
    const asyncRead = IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: mockPromise,
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
