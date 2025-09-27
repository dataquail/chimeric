import { vi, describe, it, expect } from 'vitest';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';
import { isReactiveInfiniteQuery } from './isReactiveInfiniteQuery';
import { TanstackInfiniteQueryReactiveReturnType } from './types';

describe('createReactiveInfiniteQuery', () => {
  it('should create a valid reactive infinite query from a use function', () => {
    const mockUseFunction = vi.fn(() => ({
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
    }));
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockUseFunction);
    expect(isReactiveInfiniteQuery(reactiveInfiniteQuery)).toBe(true);
  });

  it('should preserve the use function behavior', () => {
    const mockResult = {
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: {
        pages: [{ items: [1, 2, 3] }],
        pageParams: [0],
      },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: true,
      hasPreviousPage: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      refetch: vi.fn(),
      native: {} as TanstackInfiniteQueryReactiveReturnType<
        never,
        Error,
        never
      >,
    };
    const mockUseFunction = vi.fn(() => mockResult);
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockUseFunction);
    const result = reactiveInfiniteQuery.use();
    expect(result).toEqual(mockResult);
    expect(mockUseFunction).toHaveBeenCalled();
  });

  it('should handle use functions with parameters', () => {
    const mockResult = {
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: {
        pages: [{ items: ['test-item'] }],
        pageParams: [0],
      },
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
    };
    const mockUseFunction = vi.fn((args: { search: string }) => ({
      ...mockResult,
      data: {
        pages: [{ items: [args.search] }],
        pageParams: [0],
      },
    }));
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockUseFunction);
    const result = reactiveInfiniteQuery.use({ search: 'test' });
    expect(result.data?.pages[0].items[0]).toBe('test');
    expect(mockUseFunction).toHaveBeenCalledWith({ search: 'test' });
  });
});
