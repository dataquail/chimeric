/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from 'vitest';
import { isIdiomaticInfiniteQuery } from './isIdiomaticInfiniteQuery';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';

describe('isIdiomaticInfiniteQuery', () => {
  it('should return true for a valid idiomatic infinite query', () => {
    const mockIdiomaticInfiniteQuery = createIdiomaticInfiniteQuery(
      vi.fn(async () => ({ pages: [], pageParams: [] })),
    );
    expect(isIdiomaticInfiniteQuery(mockIdiomaticInfiniteQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticInfiniteQuery('not a function' as any)).toBe(false);
    expect(isIdiomaticInfiniteQuery(123 as any)).toBe(false);
    expect(isIdiomaticInfiniteQuery({} as any)).toBe(false);
    expect(isIdiomaticInfiniteQuery(null as any)).toBe(false);
    expect(isIdiomaticInfiniteQuery(undefined as any)).toBe(false);
  });
});
