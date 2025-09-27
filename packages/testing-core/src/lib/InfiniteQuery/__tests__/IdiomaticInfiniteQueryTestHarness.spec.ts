import { IdiomaticInfiniteQueryTestHarness } from '../IdiomaticInfiniteQueryTestHarness';
import {
  makeAsyncInfiniteQueryWithoutParams,
  makeAsyncInfiniteQueryWithParams,
} from '../../__tests__/infiniteQueryFixtures';

describe('IdiomaticInfiniteQueryTestHarness', () => {
  it('should wait for success without params', async () => {
    const mockInfiniteQuery = makeAsyncInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockInfiniteQuery,
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBeDefined();
    expect(harness.result.current.data?.pages).toHaveLength(2);
    expect(harness.result.current.data?.pageParams).toEqual(['', 'cursor-2']);
    expect(mockInfiniteQuery).toHaveBeenCalledTimes(1);
  });

  it('should reinvokeIdiomaticFn', async () => {
    const mockInfiniteQuery = makeAsyncInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockInfiniteQuery,
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(mockInfiniteQuery).toHaveBeenCalledTimes(1);

    await harness.waitFor(
      () => expect(harness.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBeDefined();
    expect(mockInfiniteQuery).toHaveBeenCalledTimes(2);
  });

  it('should handle params', async () => {
    const mockInfiniteQuery = makeAsyncInfiniteQueryWithParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockInfiniteQuery,
      params: { filter: 'active' },
    });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe(undefined);

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isError).toBe(false);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBeDefined();
    expect(harness.result.current.data?.pages).toHaveLength(1);
    expect(harness.result.current.data?.pages[0].data[0].text).toBe(
      'Filtered active Task 1',
    );
    expect(mockInfiniteQuery).toHaveBeenCalledWith({ filter: 'active' });
  });

  it('should handle options', async () => {
    const mockInfiniteQuery = makeAsyncInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockInfiniteQuery,
      options: {
        forceRefetch: true,
      },
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(mockInfiniteQuery).toHaveBeenCalledWith({
      options: { forceRefetch: true },
      nativeOptions: undefined,
    });
  });
});
