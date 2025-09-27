import { vi, describe, it, expect } from 'vitest';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';
import { isIdiomaticInfiniteQuery } from './isIdiomaticInfiniteQuery';

describe('createIdiomaticInfiniteQuery', () => {
  it('should create a valid idiomatic infinite query from a function', () => {
    const mockFn = vi.fn(async () => ({ pages: [], pageParams: [] }));
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    expect(isIdiomaticInfiniteQuery(idiomaticInfiniteQuery)).toBe(true);
  });

  it('should preserve the function behavior', async () => {
    const mockFn = vi.fn(async () => ({
      pages: [{ items: [1, 2, 3] }],
      pageParams: [0]
    }));
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    const result = await idiomaticInfiniteQuery();
    expect(result).toEqual({
      pages: [{ items: [1, 2, 3] }],
      pageParams: [0]
    });
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle functions with parameters', async () => {
    const mockFn = vi.fn(async (args: { search: string }) => ({
      pages: [{ items: [args.search] }],
      pageParams: [0]
    }));
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    const result = await idiomaticInfiniteQuery({ search: 'test' });
    expect(result).toEqual({
      pages: [{ items: ['test'] }],
      pageParams: [0]
    });
    expect(mockFn).toHaveBeenCalledWith({ search: 'test' });
  });
});