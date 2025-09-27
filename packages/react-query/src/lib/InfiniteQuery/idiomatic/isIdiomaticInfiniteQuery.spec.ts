import { vi, describe, it, expect } from 'vitest';
import { isIdiomaticInfiniteQuery } from './isIdiomaticInfiniteQuery';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';

describe('isIdiomaticInfiniteQuery', () => {
  it('should return true for a valid idiomatic infinite query', () => {
    const mockIdiomaticInfiniteQuery = createIdiomaticInfiniteQuery(
      vi.fn(async () => ({ pages: [], pageParams: [] }))
    );
    expect(isIdiomaticInfiniteQuery(mockIdiomaticInfiniteQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticInfiniteQuery('not a function')).toBe(false);
    expect(isIdiomaticInfiniteQuery(123)).toBe(false);
    expect(isIdiomaticInfiniteQuery({})).toBe(false);
    expect(isIdiomaticInfiniteQuery(null)).toBe(false);
    expect(isIdiomaticInfiniteQuery(undefined)).toBe(false);
  });
});