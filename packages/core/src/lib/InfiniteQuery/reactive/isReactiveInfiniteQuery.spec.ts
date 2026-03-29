/* eslint-disable @typescript-eslint/no-explicit-any */
import { isReactiveInfiniteQuery } from './isReactiveInfiniteQuery';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';

describe('isReactiveInfiniteQuery', () => {
  it('should return true for a valid reactive infinite query', () => {
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(
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
        native: {},
      })),
      vi.fn(),
    );
    expect(isReactiveInfiniteQuery(reactiveInfiniteQuery)).toBe(true);
  });

  it('should return false for a non-reactive infinite query', () => {
    const notReactiveInfiniteQuery = vi.fn();
    expect(isReactiveInfiniteQuery(notReactiveInfiniteQuery as any)).toBe(
      false,
    );
  });

  it('should return false for a null value', () => {
    expect(isReactiveInfiniteQuery(null as any)).toBe(false);
  });

  it('should return false for an undefined value', () => {
    expect(isReactiveInfiniteQuery(undefined as any)).toBe(false);
  });

  it('should return false for a plain object without use', () => {
    const plainObject = { pages: [], pageParams: [] };
    expect(isReactiveInfiniteQuery(plainObject as any)).toBe(false);
  });

  it('should return false for an idiomatic function', () => {
    const idiomaticFunction = vi.fn(
      async () =>
        ({
          pages: [],
          pageParams: [],
        } as any),
    );
    expect(isReactiveInfiniteQuery(idiomaticFunction as any)).toBe(false);
  });

  it('should return false for object with useHook but missing usePrefetchHook', () => {
    expect(
      isReactiveInfiniteQuery({ useHook: vi.fn() } as any),
    ).toBe(false);
  });

  it('should return false for object with usePrefetchHook but missing useHook', () => {
    expect(
      isReactiveInfiniteQuery({ usePrefetchHook: vi.fn() } as any),
    ).toBe(false);
  });
});
