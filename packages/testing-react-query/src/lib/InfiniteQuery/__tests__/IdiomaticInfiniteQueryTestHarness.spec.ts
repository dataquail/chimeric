import { IdiomaticInfiniteQueryTestHarness } from '../IdiomaticInfiniteQueryTestHarness';
import {
  makeIdiomaticInfiniteQueryWithoutParams,
  makeIdiomaticInfiniteQueryWithParams,
} from '../../__tests__/infiniteQueryFixtures';

describe('IdiomaticInfiniteQueryTestHarness', () => {
  it('should work with idiomatic infinite query without params', async () => {
    const mockIdiomaticInfiniteQuery =
      makeIdiomaticInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockIdiomaticInfiniteQuery,
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
  });

  it('should work with params', async () => {
    const mockIdiomaticInfiniteQuery = makeIdiomaticInfiniteQueryWithParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockIdiomaticInfiniteQuery,
      params: { filter: 'active' },
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.data).toBeDefined();
  });

  it('should handle options', async () => {
    const mockIdiomaticInfiniteQuery =
      makeIdiomaticInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockIdiomaticInfiniteQuery,
      options: {
        forceRefetch: true,
      },
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
  });

  it('should handle native options', async () => {
    const mockIdiomaticInfiniteQuery =
      makeIdiomaticInfiniteQueryWithoutParams();
    const nativeOptions = { initialPageParam: '', staleTime: 5000 };

    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockIdiomaticInfiniteQuery,
      nativeOptions,
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    expect(harness.result.current.isSuccess).toBe(true);
  });

  it('should support reinvokeIdiomaticFn', async () => {
    const mockIdiomaticInfiniteQuery =
      makeIdiomaticInfiniteQueryWithoutParams();
    const harness = IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: mockIdiomaticInfiniteQuery,
    });

    await harness.waitFor(() =>
      expect(harness.result.current.isSuccess).toBe(true),
    );

    await harness.waitFor(
      () => expect(harness.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(harness.result.current.isSuccess).toBe(true);
  });
});
