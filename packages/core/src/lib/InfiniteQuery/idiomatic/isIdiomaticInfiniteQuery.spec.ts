import { isIdiomaticInfiniteQuery } from './isIdiomaticInfiniteQuery';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';

describe('isIdiomaticInfiniteQuery', () => {
  it('should return true for a valid idiomatic infinite query', () => {
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(
      vi.fn(async () => ({ pages: [], pageParams: [] })),
    );
    expect(isIdiomaticInfiniteQuery(idiomaticInfiniteQuery)).toBe(true);
  });

  it('should return false for a non-idiomatic infinite query', () => {
    const notIdiomaticInfiniteQuery = vi.fn();
    expect(isIdiomaticInfiniteQuery(notIdiomaticInfiniteQuery)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isIdiomaticInfiniteQuery(null)).toBe(false);
  });

  it('should return false for an undefined value', () => {
    expect(isIdiomaticInfiniteQuery(undefined)).toBe(false);
  });

  it('should return false for a plain object', () => {
    const plainObject = { pages: [], pageParams: [] };
    expect(isIdiomaticInfiniteQuery(plainObject)).toBe(false);
  });

  it('should return false for a reactive query object', () => {
    const reactiveQuery = { use: vi.fn() };
    expect(isIdiomaticInfiniteQuery(reactiveQuery)).toBe(false);
  });
});
