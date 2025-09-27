import { DefineChimericInfiniteQuery } from '../chimeric/types';
import { createIdiomaticInfiniteQuery } from '../idiomatic/createIdiomaticInfiniteQuery';
import { DefineIdiomaticInfiniteQuery } from '../idiomatic/types';
import { createReactiveInfiniteQuery } from '../reactive/createReactiveInfiniteQuery';
import { DefineReactiveInfiniteQuery } from '../reactive/types';

// Mock paginated data generator
export const generateMockPages = (pageSize = 10, totalPages = 5) => {
  const pages: Array<{ items: Array<{ id: number; name: string }> }> = [];
  for (let page = 0; page < totalPages; page++) {
    const items = [];
    for (let i = 0; i < pageSize; i++) {
      const itemId = page * pageSize + i + 1;
      items.push({ id: itemId, name: `Item ${itemId}` });
    }
    pages.push({ items });
  }
  return pages;
};

// Infinite query functions without params
export const makeInfiniteQueryFnWithoutParams = () => {
  const mockPages = generateMockPages(3, 3);
  let currentPageIndex = 0;

  return vi.fn(async () => {
    const pages = mockPages.slice(0, currentPageIndex + 1);
    const pageParams = Array.from(
      { length: currentPageIndex + 1 },
      (_, i) => i,
    );
    currentPageIndex = Math.min(currentPageIndex + 1, mockPages.length - 1);

    return {
      pages,
      pageParams,
    };
  });
};

export const makeIdiomaticInfiniteQueryWithoutParams = () =>
  createIdiomaticInfiniteQuery(makeInfiniteQueryFnWithoutParams());

export const makeInfiniteQueryHookWithoutParams = () => {
  const mockPages = generateMockPages(3, 3);
  let currentPageIndex = 0;

  return vi.fn(() => {
    const pages = mockPages.slice(0, currentPageIndex + 1);
    const pageParams = Array.from(
      { length: currentPageIndex + 1 },
      (_, i) => i,
    );

    return {
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: {
        pages,
        pageParams,
      },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: currentPageIndex < mockPages.length - 1,
      hasPreviousPage: currentPageIndex > 0,
      fetchNextPage: vi.fn(async () => {
        currentPageIndex = Math.min(currentPageIndex + 1, mockPages.length - 1);
        return {
          pages: mockPages.slice(0, currentPageIndex + 1),
          pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
        };
      }),
      fetchPreviousPage: vi.fn(async () => {
        currentPageIndex = Math.max(currentPageIndex - 1, 0);
        return {
          pages: mockPages.slice(0, currentPageIndex + 1),
          pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
        };
      }),
      refetch: vi.fn(async () => ({
        pages: mockPages.slice(0, currentPageIndex + 1),
        pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
      })),
      native: 'test',
    };
  });
};

export const makeReactiveInfiniteQueryWithoutParams = () =>
  createReactiveInfiniteQuery(makeInfiniteQueryHookWithoutParams());

// Infinite query functions with params (search/filter)
export const makeInfiniteQueryFnWithParams = () => {
  return vi.fn(async (args: { search: string }) => {
    const mockPages = generateMockPages(3, 3);
    const filteredPages = mockPages.map((page) => ({
      items: page.items.filter((item) =>
        item.name.toLowerCase().includes(args.search.toLowerCase()),
      ),
    }));

    return {
      pages: filteredPages.slice(0, 2),
      pageParams: [0, 1],
    };
  });
};

export const makeIdiomaticInfiniteQueryWithParams = () =>
  createIdiomaticInfiniteQuery(makeInfiniteQueryFnWithParams());

export const makeInfiniteQueryHookWithParams = () => {
  return vi.fn((args: { search: string }) => {
    const mockPages = generateMockPages(3, 3);
    const filteredPages = mockPages.map((page) => ({
      items: page.items.filter((item) =>
        item.name.toLowerCase().includes(args.search.toLowerCase()),
      ),
    }));

    return {
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: {
        pages: filteredPages.slice(0, 2),
        pageParams: [0, 1],
      },
      isFetchingNextPage: false,
      isFetchingPreviousPage: false,
      hasNextPage: true,
      hasPreviousPage: false,
      fetchNextPage: vi.fn(async () => ({
        pages: filteredPages.slice(0, 3),
        pageParams: [0, 1, 2],
      })),
      fetchPreviousPage: vi.fn(async () => ({
        pages: filteredPages.slice(0, 1),
        pageParams: [0],
      })),
      refetch: vi.fn(async () => ({
        pages: filteredPages.slice(0, 2),
        pageParams: [0, 1],
      })),
      native: 'test',
    };
  });
};

export const makeReactiveInfiniteQueryWithParams = () =>
  createReactiveInfiniteQuery(makeInfiniteQueryHookWithParams());

// Error scenarios
export const makeInfiniteQueryHookWithError = () =>
  vi.fn(() => ({
    isIdle: false,
    isPending: false,
    isSuccess: false,
    isError: true,
    error: new Error('Failed to fetch data'),
    data: undefined,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    hasNextPage: false,
    hasPreviousPage: false,
    fetchNextPage: vi.fn(async () => {
      throw new Error('Failed to fetch next page');
    }),
    fetchPreviousPage: vi.fn(async () => {
      throw new Error('Failed to fetch previous page');
    }),
    refetch: vi.fn(async () => {
      throw new Error('Failed to refetch');
    }),
    native: 'test',
  }));

// Type definitions for tests
export type ChimericInfiniteQueryWithoutParams = DefineChimericInfiniteQuery<
  () => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type ChimericInfiniteQueryWithParams = DefineChimericInfiniteQuery<
  (args: {
    search: string;
  }) => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type IdiomaticInfiniteQueryWithoutParams = DefineIdiomaticInfiniteQuery<
  () => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type IdiomaticInfiniteQueryWithParams = DefineIdiomaticInfiniteQuery<
  (args: {
    search: string;
  }) => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type ReactiveInfiniteQueryWithoutParams = DefineReactiveInfiniteQuery<
  () => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type ReactiveInfiniteQueryWithParams = DefineReactiveInfiniteQuery<
  (args: {
    search: string;
  }) => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;
