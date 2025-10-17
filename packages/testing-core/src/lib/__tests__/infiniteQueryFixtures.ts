import {
  createIdiomaticInfiniteQuery,
  createReactiveInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';

type PageData<T> = {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
};

export const InfiniteQueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticInfiniteQueryOptions<string>;
          nativeOptions?: unknown;
        }) => ({
          pages: [
            { data: ['Item 1', 'Item 2'], nextCursor: 'cursor-2' },
            { data: ['Item 3', 'Item 4'], nextCursor: undefined },
          ],
          pageParams: ['', 'cursor-2'],
        }),
      );
      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery(fn),
      };
    },
    getReactive: () => {
      const fetchNextPageFn = vi.fn(async () => ({
        pages: [
          { data: ['Item 1', 'Item 2'], nextCursor: 'cursor-2' },
          { data: ['Item 3', 'Item 4'], nextCursor: undefined },
        ],
        pageParams: ['', 'cursor-2'],
      }));
      const fetchPreviousPageFn = vi.fn(async () => ({
        pages: [
          { data: ['Item -1', 'Item 0'], prevCursor: undefined },
          { data: ['Item 1', 'Item 2'], nextCursor: 'cursor-2' },
        ],
        pageParams: ['cursor-prev', ''],
      }));
      const refetchFn = vi.fn(async () => ({
        pages: [
          { data: ['Item 1', 'Item 2'], nextCursor: 'cursor-2' },
          { data: ['Item 3', 'Item 4'], nextCursor: undefined },
        ],
        pageParams: ['', 'cursor-2'],
      }));
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: unknown;
        }) => ({
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: {
            pages: [{ data: ['Item 1', 'Item 2'], nextCursor: 'cursor-2' }],
            pageParams: [''],
          } as
            | {
                pages: Array<PageData<string>>;
                pageParams: string[];
              }
            | undefined,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          hasNextPage: true,
          hasPreviousPage: false,
          fetchNextPage: fetchNextPageFn,
          fetchPreviousPage: fetchPreviousPageFn,
          refetch: refetchFn,
          native: undefined as unknown,
        }),
      );
      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
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
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params: { filter: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<string>;
            nativeOptions?: unknown;
          },
        ) => ({
          pages: [
            {
              data: [`Filtered ${params.filter} Item 1`],
              nextCursor: undefined,
            },
          ],
          pageParams: [''],
        }),
      );
      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery<
          { filter: string },
          PageData<string>,
          string,
          unknown
        >(fn),
      };
    },
    getReactive: () => {
      let _params: { filter: string };
      const fetchNextPageFn = vi.fn(async () => ({
        pages: [
          {
            data: [`Filtered ${_params.filter} Item 2`],
            nextCursor: undefined,
          },
        ],
        pageParams: ['cursor-2'],
      }));
      const fetchPreviousPageFn = vi.fn(async () => ({
        pages: [
          {
            data: [`Filtered ${_params.filter} Item 0`],
            prevCursor: undefined,
          },
        ],
        pageParams: ['cursor-prev'],
      }));
      const refetchFn = vi.fn(async () => ({
        pages: [
          {
            data: [`Filtered ${_params.filter} Item 1`],
            nextCursor: 'cursor-2',
          },
        ],
        pageParams: [''],
      }));
      const fn = vi.fn(
        (
          params: { filter: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          _params = params;
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: {
              pages: [
                {
                  data: [`Filtered ${_params.filter} Item 1`],
                  nextCursor: 'cursor-2',
                },
              ],
              pageParams: [''],
            } as
              | {
                  pages: Array<PageData<string>>;
                  pageParams: string[];
                }
              | undefined,
            isFetchingNextPage: false,
            isFetchingPreviousPage: false,
            hasNextPage: true,
            hasPreviousPage: false,
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
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
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params?: { filter: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<string>;
            nativeOptions?: unknown;
          },
        ) => ({
          pages: [
            {
              data: params
                ? [`Filtered ${params.filter} Item 1`]
                : ['All Items 1'],
              nextCursor: undefined,
            },
          ],
          pageParams: [''],
        }),
      );
      return {
        fn,
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery<
          { filter: string },
          PageData<string>,
          string,
          unknown
        >(fn),
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        (
          params?: { filter: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          // Capture params for this specific call
          const capturedParams = params;
          const fetchNextPageFn = vi.fn(async () => ({
            pages: [
              {
                data: capturedParams
                  ? [`Filtered ${capturedParams.filter} Item 2`]
                  : ['All Items 2'],
                nextCursor: undefined,
              },
            ],
            pageParams: ['cursor-2'],
          }));
          const fetchPreviousPageFn = vi.fn(async () => ({
            pages: [
              {
                data: capturedParams
                  ? [`Filtered ${capturedParams.filter} Item 0`]
                  : ['All Items 0'],
                prevCursor: undefined,
              },
            ],
            pageParams: ['cursor-prev'],
          }));
          const refetchFn = vi.fn(async () => ({
            pages: [
              {
                data: capturedParams
                  ? [`Filtered ${capturedParams.filter} Item 1`]
                  : ['All Items 1'],
                nextCursor: 'cursor-2',
              },
            ],
            pageParams: [''],
          }));
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: {
              pages: [
                {
                  data: capturedParams
                    ? [`Filtered ${capturedParams.filter} Item 1`]
                    : ['All Items 1'],
                  nextCursor: 'cursor-2',
                },
              ],
              pageParams: [''],
            } as
              | {
                  pages: Array<PageData<string>>;
                  pageParams: string[];
                }
              | undefined,
            isFetchingNextPage: false,
            isFetchingPreviousPage: false,
            hasNextPage: true,
            hasPreviousPage: false,
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      // Create shared mocks for testing call counts
      const sharedFetchNextPageFn = vi.fn(async () => ({
        pages: [{ data: ['Item 2'], nextCursor: undefined }],
        pageParams: ['cursor-2'],
      }));
      const sharedFetchPreviousPageFn = vi.fn(async () => ({
        pages: [{ data: ['Item 0'], prevCursor: undefined }],
        pageParams: ['cursor-prev'],
      }));
      const sharedRefetchFn = vi.fn(async () => ({
        pages: [{ data: ['Item 1'], nextCursor: 'cursor-2' }],
        pageParams: [''],
      }));
      return {
        fn,
        fetchNextPageFn: sharedFetchNextPageFn,
        fetchPreviousPageFn: sharedFetchPreviousPageFn,
        refetchFn: sharedRefetchFn,
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
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
      };
    },
  },
};
