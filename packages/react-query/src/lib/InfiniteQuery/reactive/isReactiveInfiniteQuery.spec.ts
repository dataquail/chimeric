import { vi, describe, it, expect } from 'vitest';
import { isReactiveInfiniteQuery } from './isReactiveInfiniteQuery';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';
import { TanstackInfiniteQueryReactiveReturnType } from './types';

describe('isReactiveInfiniteQuery', () => {
  it('should return true for a valid reactive infinite query', () => {
    const mockReactiveInfiniteQuery = createReactiveInfiniteQuery(
      vi.fn(() => ({
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: { pages: [], pageParams: [] },
        isFetchingNextPage: false,
        isFetchingPreviousPage: false,
        hasNextPage: false,
        hasPreviousPage: false,
        fetchNextPage: vi.fn(),
        fetchPreviousPage: vi.fn(),
        refetch: vi.fn(),
        native: {} as TanstackInfiniteQueryReactiveReturnType<
          never,
          Error,
          never
        >,
      })),
    );
    expect(isReactiveInfiniteQuery(mockReactiveInfiniteQuery)).toBe(true);
  });

  it('should return false for non-reactive values', () => {
    expect(isReactiveInfiniteQuery('not a reactive query')).toBe(false);
    expect(isReactiveInfiniteQuery(123)).toBe(false);
    expect(isReactiveInfiniteQuery({})).toBe(false);
    expect(isReactiveInfiniteQuery(null)).toBe(false);
    expect(isReactiveInfiniteQuery(undefined)).toBe(false);
    expect(isReactiveInfiniteQuery(vi.fn())).toBe(false);
  });
});
