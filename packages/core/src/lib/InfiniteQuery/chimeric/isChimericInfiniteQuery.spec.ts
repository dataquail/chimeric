import { isChimericInfiniteQuery } from './isChimericInfiniteQuery';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';
import { createIdiomaticInfiniteQuery } from '../idiomatic/createIdiomaticInfiniteQuery';
import { createReactiveInfiniteQuery } from '../reactive/createReactiveInfiniteQuery';

describe('isChimericInfiniteQuery', () => {
  it('should return true for a valid chimeric infinite query', () => {
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(
      vi.fn(async () => ({ pages: [], pageParams: [] })),
    );
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
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });
    expect(isChimericInfiniteQuery(chimericInfiniteQuery)).toBe(true);
  });

  it('should return false for a non-chimeric infinite query', () => {
    const notChimericInfiniteQuery = vi.fn();
    expect(isChimericInfiniteQuery(notChimericInfiniteQuery)).toBe(false);
  });

  it('should return false for only an idiomatic infinite query', () => {
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(
      vi.fn(async () => ({ pages: [], pageParams: [] })),
    );
    expect(isChimericInfiniteQuery(idiomaticInfiniteQuery)).toBe(false);
  });

  it('should return false for only a reactive infinite query', () => {
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
    expect(isChimericInfiniteQuery(reactiveInfiniteQuery)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isChimericInfiniteQuery(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isChimericInfiniteQuery(undefined)).toBe(false);
  });
});
