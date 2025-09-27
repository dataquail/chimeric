import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';
import { isReactiveInfiniteQuery } from './isReactiveInfiniteQuery';

describe('createReactiveInfiniteQuery', () => {
  it('should create a valid reactive infinite query from a hook function', () => {
    const mockHook = vi.fn(() => ({
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
    }));
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockHook);
    expect(isReactiveInfiniteQuery(reactiveInfiniteQuery)).toBe(true);
  });

  it('should preserve the hook function behavior', () => {
    const mockData = {
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: { pages: [{ items: [1, 2, 3] }], pageParams: [0] },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: true,
      hasPreviousPage: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      refetch: vi.fn(),
      native: {},
    };
    const mockHook = vi.fn(() => mockData);
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockHook);
    const result = reactiveInfiniteQuery.use();
    expect(result).toEqual(mockData);
    expect(mockHook).toHaveBeenCalled();
  });

  it('should handle hooks with parameters', () => {
    const mockHook = vi.fn((args: { search: string }) => ({
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: { pages: [{ items: [args.search] }], pageParams: [0] },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      refetch: vi.fn(),
      native: {},
    }));
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockHook);
    const result = reactiveInfiniteQuery.use({ search: 'test' });
    expect(result.data?.pages[0].items[0]).toBe('test');
    expect(mockHook).toHaveBeenCalledWith({ search: 'test' });
  });

  it('should handle pagination functions', async () => {
    const fetchNextPageMock = vi.fn(async () => ({
      pages: [{ items: [1, 2, 3] }, { items: [4, 5, 6] }],
      pageParams: [0, 1],
    }));
    const fetchPreviousPageMock = vi.fn(async () => ({
      pages: [],
      pageParams: [],
    }));
    const refetchMock = vi.fn(async () => ({
      pages: [{ items: [1, 2, 3] }],
      pageParams: [0],
    }));

    const mockHook = vi.fn(() => ({
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: { pages: [{ items: [1, 2, 3] }], pageParams: [0] },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: true,
      hasPreviousPage: false,
      fetchNextPage: fetchNextPageMock,
      fetchPreviousPage: fetchPreviousPageMock,
      refetch: refetchMock,
      native: {},
    }));

    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockHook);
    const result = reactiveInfiniteQuery.use();

    await result.fetchNextPage();
    expect(fetchNextPageMock).toHaveBeenCalled();

    await result.fetchPreviousPage();
    expect(fetchPreviousPageMock).toHaveBeenCalled();

    await result.refetch();
    expect(refetchMock).toHaveBeenCalled();
  });

  it('should handle error states', () => {
    const mockError = new Error('Failed to fetch');
    const mockHook = vi.fn(() => ({
      isIdle: false,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: mockError,
      data: undefined,
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: false,
      hasPreviousPage: false,
      fetchNextPage: vi.fn(),
      fetchPreviousPage: vi.fn(),
      refetch: vi.fn(),
      native: {},
    }));
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(mockHook);
    const result = reactiveInfiniteQuery.use();
    expect(result.isError).toBe(true);
    expect(result.error).toBe(mockError);
    expect(result.data).toBeUndefined();
  });

  it('should throw error for non-function input', () => {
    expect(() => {
      createReactiveInfiniteQuery({} as any);
    }).toThrow();
  });
});
