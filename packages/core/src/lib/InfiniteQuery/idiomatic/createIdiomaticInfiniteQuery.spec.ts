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
      pageParams: [0],
    }));
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    const result = await idiomaticInfiniteQuery();
    expect(result).toEqual({
      pages: [{ items: [1, 2, 3] }],
      pageParams: [0],
    });
    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle functions with parameters', async () => {
    const mockFn = vi.fn(async (args: { search: string }) => ({
      pages: [{ items: [args.search] }],
      pageParams: [0],
    }));
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    const result = await idiomaticInfiniteQuery({ search: 'test' });
    expect(result).toEqual({
      pages: [{ items: ['test'] }],
      pageParams: [0],
    });
    expect(mockFn).toHaveBeenCalledWith({ search: 'test' });
  });

  it('should handle functions with options parameter', async () => {
    const mockFn = vi.fn(async (params: any) => {
      const forceRefetch = params?.options?.forceRefetch;
      return {
        pages: [{ items: [forceRefetch ? 'refetched' : 'cached'] }],
        pageParams: [0],
      };
    });
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(mockFn);
    const result = await idiomaticInfiniteQuery({
      options: { forceRefetch: true },
    });
    expect(result).toEqual({
      pages: [{ items: ['refetched'] }],
      pageParams: [0],
    });
  });

  it('should throw error for non-function input', () => {
    expect(() => {
      createIdiomaticInfiniteQuery({} as any);
    }).toThrow();
  });
});
