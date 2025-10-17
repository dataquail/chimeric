import { DefineChimericInfiniteQuery } from '../chimeric/types';
import { createIdiomaticInfiniteQuery } from '../idiomatic/createIdiomaticInfiniteQuery';
import {
  DefineIdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
} from '../idiomatic/types';
import { createReactiveInfiniteQuery } from '../reactive/createReactiveInfiniteQuery';
import {
  DefineReactiveInfiniteQuery,
  ReactiveInfiniteQueryOptions,
} from '../reactive/types';

// Mock data types
type MockItem = { id: number; name: string };
type MockPage = { items: MockItem[] };

// Mock paginated data generator
export const generateMockPages = (pageSize = 10, totalPages = 5) => {
  const pages: MockPage[] = [];
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

export const InfiniteQueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const mockPages = generateMockPages(3, 3);
      let currentPageIndex = 0;

      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticInfiniteQueryOptions<number>;
          nativeOptions?: unknown;
        }) => {
          const pages = mockPages.slice(0, currentPageIndex + 1);
          const pageParams = Array.from(
            { length: currentPageIndex + 1 },
            (_, i) => i,
          );
          currentPageIndex = Math.min(
            currentPageIndex + 1,
            mockPages.length - 1,
          );
          return {
            pages,
            pageParams,
          };
        },
      );

      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          () => Promise<{ pages: MockPage[]; pageParams: number[] }>,
          MockPage,
          number
        >,
      };
    },
    getReactive: () => {
      const mockPages = generateMockPages(3, 3);
      let currentPageIndex = 0;

      const fetchNextPageFn = vi.fn(async () => {
        currentPageIndex = Math.min(currentPageIndex + 1, mockPages.length - 1);
        return {
          pages: mockPages.slice(0, currentPageIndex + 1),
          pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
        };
      });

      const fetchPreviousPageFn = vi.fn(async () => {
        currentPageIndex = Math.max(currentPageIndex - 1, 0);
        return {
          pages: mockPages.slice(0, currentPageIndex + 1),
          pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
        };
      });

      const refetchFn = vi.fn(async () => ({
        pages: mockPages.slice(0, currentPageIndex + 1),
        pageParams: Array.from({ length: currentPageIndex + 1 }, (_, i) => i),
      }));

      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: unknown;
        }) => ({
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: {
            pages: mockPages.slice(0, currentPageIndex + 1),
            pageParams: Array.from(
              { length: currentPageIndex + 1 },
              (_, i) => i,
            ),
          },
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          hasNextPage: currentPageIndex < mockPages.length - 1,
          hasPreviousPage: currentPageIndex > 0,
          fetchNextPage: fetchNextPageFn,
          fetchPreviousPage: fetchPreviousPageFn,
          refetch: refetchFn,
          native: 'test' as unknown,
        }),
      );

      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          () => Promise<{ pages: MockPage[]; pageParams: number[] }>,
          MockPage,
          number
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withoutParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        annotation: {} as DefineChimericInfiniteQuery<
          () => Promise<{ pages: MockPage[]; pageParams: number[] }>,
          MockPage,
          number
        >,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const mockPages = generateMockPages(3, 3);

      const fn = vi.fn(
        async (
          params: { search: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<number>;
            nativeOptions?: unknown;
          },
        ) => {
          const filteredPages = mockPages.map((page) => ({
            items: page.items.filter((item) =>
              item.name.toLowerCase().includes(params.search.toLowerCase()),
            ),
          }));
          return {
            pages: filteredPages.slice(0, 2),
            pageParams: [0, 1],
          };
        },
      );

      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
    getReactive: () => {
      const mockPages = generateMockPages(3, 3);
      let _params: { search: string };

      const fetchNextPageFn = vi.fn(async () => {
        const filteredPages = mockPages.map((page) => ({
          items: page.items.filter((item) =>
            item.name.toLowerCase().includes(_params.search.toLowerCase()),
          ),
        }));
        return {
          pages: filteredPages.slice(0, 3),
          pageParams: [0, 1, 2],
        };
      });

      const fetchPreviousPageFn = vi.fn(async () => {
        const filteredPages = mockPages.map((page) => ({
          items: page.items.filter((item) =>
            item.name.toLowerCase().includes(_params.search.toLowerCase()),
          ),
        }));
        return {
          pages: filteredPages.slice(0, 1),
          pageParams: [0],
        };
      });

      const refetchFn = vi.fn(async () => {
        const filteredPages = mockPages.map((page) => ({
          items: page.items.filter((item) =>
            item.name.toLowerCase().includes(_params.search.toLowerCase()),
          ),
        }));
        return {
          pages: filteredPages.slice(0, 2),
          pageParams: [0, 1],
        };
      });

      const fn = vi.fn(
        (
          params: { search: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          _params = params;
          const filteredPages = mockPages.map((page) => ({
            items: page.items.filter((item) =>
              item.name.toLowerCase().includes(_params.search.toLowerCase()),
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
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native: 'test' as unknown,
          };
        },
      );

      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withParams.getIdiomatic();
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        annotation: {} as DefineChimericInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const mockPages = generateMockPages(3, 3);

      const fn = vi.fn(
        async (
          params?: { search: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<number>;
            nativeOptions?: unknown;
          },
        ) => {
          if (params) {
            const filteredPages = mockPages.map((page) => ({
              items: page.items.filter((item) =>
                item.name.toLowerCase().includes(params.search.toLowerCase()),
              ),
            }));
            return {
              pages: filteredPages.slice(0, 2),
              pageParams: [0, 1],
            };
          }
          return {
            pages: mockPages.slice(0, 2),
            pageParams: [0, 1],
          };
        },
      );

      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
    getReactive: () => {
      const mockPages = generateMockPages(3, 3);

      const fn = vi.fn(
        (
          params?: { search: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          // Capture params for this specific call
          const capturedParams = params;

          const fetchNextPageFn = vi.fn(async () => {
            if (capturedParams) {
              const filteredPages = mockPages.map((page) => ({
                items: page.items.filter((item) =>
                  item.name
                    .toLowerCase()
                    .includes(capturedParams.search.toLowerCase()),
                ),
              }));
              return {
                pages: filteredPages.slice(0, 3),
                pageParams: [0, 1, 2],
              };
            }
            return {
              pages: mockPages.slice(0, 3),
              pageParams: [0, 1, 2],
            };
          });

          const fetchPreviousPageFn = vi.fn(async () => {
            if (capturedParams) {
              const filteredPages = mockPages.map((page) => ({
                items: page.items.filter((item) =>
                  item.name
                    .toLowerCase()
                    .includes(capturedParams.search.toLowerCase()),
                ),
              }));
              return {
                pages: filteredPages.slice(0, 1),
                pageParams: [0],
              };
            }
            return {
              pages: mockPages.slice(0, 1),
              pageParams: [0],
            };
          });

          const refetchFn = vi.fn(async () => {
            if (capturedParams) {
              const filteredPages = mockPages.map((page) => ({
                items: page.items.filter((item) =>
                  item.name
                    .toLowerCase()
                    .includes(capturedParams.search.toLowerCase()),
                ),
              }));
              return {
                pages: filteredPages.slice(0, 2),
                pageParams: [0, 1],
              };
            }
            return {
              pages: mockPages.slice(0, 2),
              pageParams: [0, 1],
            };
          });

          if (capturedParams) {
            const filteredPages = mockPages.map((page) => ({
              items: page.items.filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(capturedParams.search.toLowerCase()),
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
              fetchNextPage: fetchNextPageFn,
              fetchPreviousPage: fetchPreviousPageFn,
              refetch: refetchFn,
              native: 'test' as unknown,
            };
          }

          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: {
              pages: mockPages.slice(0, 2),
              pageParams: [0, 1],
            },
            isFetchingNextPage: false,
            isFetchingPreviousPage: false,
            hasNextPage: true,
            hasPreviousPage: false,
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native: 'test' as unknown,
          };
        },
      );

      // Create shared mock functions for testing call counts
      const sharedFetchNextPageFn = vi.fn(async () => ({
        pages: mockPages.slice(0, 3),
        pageParams: [0, 1, 2],
      }));
      const sharedFetchPreviousPageFn = vi.fn(async () => ({
        pages: mockPages.slice(0, 1),
        pageParams: [0],
      }));
      const sharedRefetchFn = vi.fn(async () => ({
        pages: mockPages.slice(0, 2),
        pageParams: [0, 1],
      }));

      return {
        fn,
        fetchNextPageFn: sharedFetchNextPageFn,
        fetchPreviousPageFn: sharedFetchPreviousPageFn,
        refetchFn: sharedRefetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        annotation: {} as DefineChimericInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: MockPage[];
            pageParams: number[];
          }>,
          MockPage,
          number
        >,
      };
    },
  },
};
