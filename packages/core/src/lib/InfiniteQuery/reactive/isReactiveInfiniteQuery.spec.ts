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
    );
    expect(isReactiveInfiniteQuery(reactiveInfiniteQuery)).toBe(true);
  });

  it('should return false for a non-reactive infinite query', () => {
    const notReactiveInfiniteQuery = vi.fn();
    expect(isReactiveInfiniteQuery(notReactiveInfiniteQuery)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isReactiveInfiniteQuery(null)).toBe(false);
  });

  it('should return false for an undefined value', () => {
    expect(isReactiveInfiniteQuery(undefined)).toBe(false);
  });

  it('should return false for a plain object without use', () => {
    const plainObject = { pages: [], pageParams: [] };
    expect(isReactiveInfiniteQuery(plainObject)).toBe(false);
  });

  it('should return false for an idiomatic function', () => {
    const idiomaticFunction = vi.fn(async () => ({
      pages: [],
      pageParams: [],
    }));
    expect(isReactiveInfiniteQuery(idiomaticFunction)).toBe(false);
  });
});
