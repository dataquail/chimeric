import {
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import { DefineChimericInfiniteQuery } from '../chimeric/types';
import { createIdiomaticInfiniteQuery } from '../idiomatic/createIdiomaticInfiniteQuery';
import {
  DefineIdiomaticInfiniteQuery,
  TanstackInfiniteQueryIdiomaticNativeOptions,
} from '../idiomatic/types';
import { createReactiveInfiniteQuery } from '../reactive/createReactiveInfiniteQuery';
import {
  DefineReactiveInfiniteQuery,
  TanstackInfiniteQueryReactiveNativeOptions,
  TanstackInfiniteQueryReactiveReturnType,
} from '../reactive/types';

type PageData = { items: Array<{ id: number; name: string }> };

export const InfiniteQueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticInfiniteQueryOptions<number>;
          nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
            PageData,
            Error,
            number,
            string[]
          >;
        }) => ({
          pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
          pageParams: [0],
        }),
      );
      return {
        fn,
        queryFn: vi.fn(() =>
          Promise.resolve({ items: [{ id: 1, name: 'Item 1' }] }),
        ),
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          () => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
    getReactive: () => {
      const fetchNextPageFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
        pageParams: [0],
      }));
      const fetchPreviousPageFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
        pageParams: [0],
      }));
      const refetchFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
        pageParams: [0],
      }));
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
            PageData,
            Error,
            number,
            string[]
          >;
        }) => ({
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: {
            pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
            pageParams: [0],
          } as { pages: Array<PageData>; pageParams: number[] } | undefined,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          hasNextPage: true,
          hasPreviousPage: false,
          fetchNextPage: fetchNextPageFn,
          fetchPreviousPage: fetchPreviousPageFn,
          refetch: refetchFn,
          native:
            undefined as unknown as TanstackInfiniteQueryReactiveReturnType<
              PageData,
              Error,
              number
            >,
        }),
      );
      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        queryFn: vi.fn(() =>
          Promise.resolve({ items: [{ id: 1, name: 'Item 1' }] }),
        ),
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          () => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
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
        queryFn: vi.fn(() =>
          Promise.resolve({ items: [{ id: 1, name: 'Item 1' }] }),
        ),
        annotation: {} as DefineChimericInfiniteQuery<
          () => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params: { search: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<number>;
            nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
              PageData,
              Error,
              number,
              string[]
            >;
          },
        ) => ({
          pages: [
            {
              items: [{ id: 1, name: `Filtered by ${params.search}` }],
            },
          ],
          pageParams: [0],
        }),
      );
      return {
        fn,
        queryFn: vi.fn((args: { search: string }) =>
          Promise.resolve({
            items: [{ id: 1, name: `Filtered by ${args.search}` }],
          }),
        ),
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery<
          { search: string },
          PageData,
          number,
          Error,
          string[]
        >(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
    getReactive: () => {
      let _params: { search: string };
      const fetchNextPageFn = vi.fn(async () => ({
        pages: [
          {
            items: [{ id: 2, name: `Filtered by ${_params.search} - Page 2` }],
          },
        ],
        pageParams: [1],
      }));
      const fetchPreviousPageFn = vi.fn(async () => ({
        pages: [
          {
            items: [{ id: 0, name: `Filtered by ${_params.search} - Page 0` }],
          },
        ],
        pageParams: [-1],
      }));
      const refetchFn = vi.fn(async () => ({
        pages: [
          {
            items: [{ id: 1, name: `Filtered by ${_params.search}` }],
          },
        ],
        pageParams: [0],
      }));
      const fn = vi.fn(
        (
          params: { search: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
              PageData,
              Error,
              number,
              string[]
            >;
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
                  items: [{ id: 1, name: `Filtered by ${_params.search}` }],
                },
              ],
              pageParams: [0],
            } as
              | {
                  pages: Array<PageData>;
                  pageParams: number[];
                }
              | undefined,
            isFetchingNextPage: false,
            isFetchingPreviousPage: false,
            hasNextPage: true,
            hasPreviousPage: false,
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native:
              undefined as unknown as TanstackInfiniteQueryReactiveReturnType<
                PageData,
                Error,
                number
              >,
          };
        },
      );
      return {
        fn,
        fetchNextPageFn,
        fetchPreviousPageFn,
        refetchFn,
        queryFn: vi.fn((args: { search: string }) =>
          Promise.resolve({
            items: [{ id: 1, name: `Filtered by ${args.search}` }],
          }),
        ),
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
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
        queryFn: vi.fn((args: { search: string }) =>
          Promise.resolve({
            items: [{ id: 1, name: `Filtered by ${args.search}` }],
          }),
        ),
        annotation: {} as DefineChimericInfiniteQuery<
          (params: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params?: { search: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<number>;
            nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
              PageData,
              Error,
              number,
              string[]
            >;
          },
        ) => ({
          pages: [
            {
              items: [
                {
                  id: 1,
                  name: params ? `Filtered by ${params.search}` : 'All items',
                },
              ],
            },
          ],
          pageParams: [0],
        }),
      );
      return {
        fn,
        queryFn: vi.fn((args?: { search: string }) =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: args ? `Filtered by ${args.search}` : 'All items',
              },
            ],
          }),
        ),
        idiomaticInfiniteQuery: createIdiomaticInfiniteQuery<
          { search: string },
          PageData,
          number,
          Error,
          string[]
        >(fn),
        annotation: {} as DefineIdiomaticInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        (
          params?: { search: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
              PageData,
              Error,
              number,
              string[]
            >;
          },
        ) => {
          // Capture params for this specific call
          const capturedParams = params;
          const fetchNextPageFn = vi.fn(async () => ({
            pages: [
              {
                items: [
                  {
                    id: 2,
                    name: capturedParams
                      ? `Filtered by ${capturedParams.search} - Page 2`
                      : 'All items - Page 2',
                  },
                ],
              },
            ],
            pageParams: [1],
          }));
          const fetchPreviousPageFn = vi.fn(async () => ({
            pages: [
              {
                items: [
                  {
                    id: 0,
                    name: capturedParams
                      ? `Filtered by ${capturedParams.search} - Page 0`
                      : 'All items - Page 0',
                  },
                ],
              },
            ],
            pageParams: [-1],
          }));
          const refetchFn = vi.fn(async () => ({
            pages: [
              {
                items: [
                  {
                    id: 1,
                    name: capturedParams
                      ? `Filtered by ${capturedParams.search}`
                      : 'All items',
                  },
                ],
              },
            ],
            pageParams: [0],
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
                  items: [
                    {
                      id: 1,
                      name: capturedParams
                        ? `Filtered by ${capturedParams.search}`
                        : 'All items',
                    },
                  ],
                },
              ],
              pageParams: [0],
            } as
              | {
                  pages: Array<PageData>;
                  pageParams: number[];
                }
              | undefined,
            isFetchingNextPage: false,
            isFetchingPreviousPage: false,
            hasNextPage: true,
            hasPreviousPage: false,
            fetchNextPage: fetchNextPageFn,
            fetchPreviousPage: fetchPreviousPageFn,
            refetch: refetchFn,
            native:
              undefined as unknown as TanstackInfiniteQueryReactiveReturnType<
                PageData,
                Error,
                number
              >,
          };
        },
      );
      // Create shared mocks for testing call counts
      const sharedFetchNextPageFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 2, name: 'Page 2' }] }],
        pageParams: [1],
      }));
      const sharedFetchPreviousPageFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 0, name: 'Page 0' }] }],
        pageParams: [-1],
      }));
      const sharedRefetchFn = vi.fn(async () => ({
        pages: [{ items: [{ id: 1, name: 'Refetch' }] }],
        pageParams: [0],
      }));
      return {
        fn,
        fetchNextPageFn: sharedFetchNextPageFn,
        fetchPreviousPageFn: sharedFetchPreviousPageFn,
        refetchFn: sharedRefetchFn,
        queryFn: vi.fn((args?: { search: string }) =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: args ? `Filtered by ${args.search}` : 'All items',
              },
            ],
          }),
        ),
        reactiveInfiniteQuery: createReactiveInfiniteQuery(fn),
        annotation: {} as DefineReactiveInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
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
        queryFn: vi.fn((args?: { search: string }) =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: args ? `Filtered by ${args.search}` : 'All items',
              },
            ],
          }),
        ),
        annotation: {} as DefineChimericInfiniteQuery<
          (params?: { search: string }) => Promise<{
            pages: Array<PageData>;
            pageParams: number[];
          }>,
          PageData,
          number,
          Error,
          string[]
        >,
      };
    },
  },
};
