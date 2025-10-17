import {
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import {
  IdiomaticInfiniteQueryFactory,
  ReactiveInfiniteQueryFactory,
  TanstackInfiniteQueryIdiomaticNativeOptions,
  TanstackInfiniteQueryReactiveNativeOptions,
} from '@chimeric/react-query';
import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';

type PageData<T> = {
  data: T[];
  nextCursor?: string;
  prevCursor?: string;
};

export const InfiniteQueryTestFixtures = {
  withoutParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticInfiniteQueryOptions<string>;
          nativeOptions?: unknown;
        }) => ({
          pages: [
            {
              data: ['Item 1', 'Item 2'],
              nextCursor: 'cursor-2',
              prevCursor: undefined,
            },
            {
              data: ['Item 3', 'Item 4'],
              nextCursor: undefined,
              prevCursor: undefined,
            },
          ],
          pageParams: ['', 'cursor-2'],
        }),
      );
      const queryFn = vi.fn(({ pageParam }: { pageParam: string }) => {
        fn();
        return Promise.resolve({
          data: pageParam === '' ? ['Item 1', 'Item 2'] : ['Item 3', 'Item 4'],
          nextCursor: pageParam === '' ? ('cursor-2' as string) : undefined,
          prevCursor: undefined,
        });
      });
      return {
        fn,
        queryFn,
        idiomaticInfiniteQuery: IdiomaticInfiniteQueryFactory({
          queryClient,
          getInfiniteQueryOptions: () =>
            infiniteQueryOptions({
              queryKey: ['test'],
              queryFn,
              initialPageParam: '' as string,
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getReactive: () => {
      const queryFn = vi.fn(({ pageParam }: { pageParam: string }) =>
        Promise.resolve({
          data: pageParam === '' ? ['Item 1', 'Item 2'] : ['Item 3', 'Item 4'],
          nextCursor: pageParam === '' ? ('cursor-2' as string) : undefined,
          prevCursor: undefined,
        }),
      );
      const refetchFn = vi.fn(async () => ({
        pages: [
          {
            data: ['Item 1', 'Item 2'],
            nextCursor: 'cursor-2',
            prevCursor: undefined,
          },
          {
            data: ['Item 3', 'Item 4'],
            nextCursor: undefined,
            prevCursor: undefined,
          },
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
            pages: [
              {
                data: ['Item 1', 'Item 2'],
                nextCursor: 'cursor-2',
                prevCursor: undefined,
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
          fetchNextPage: vi.fn(async () => ({
            pages: [
              {
                data: ['Item 1', 'Item 2'],
                nextCursor: 'cursor-2',
                prevCursor: undefined,
              },
              {
                data: ['Item 3', 'Item 4'],
                nextCursor: undefined,
                prevCursor: undefined,
              },
            ],
            pageParams: ['', 'cursor-2'],
          })),
          fetchPreviousPage: vi.fn(async () => ({
            pages: [
              {
                data: ['Item -1', 'Item 0'],
                prevCursor: undefined,
                nextCursor: undefined,
              },
              {
                data: ['Item 1', 'Item 2'],
                nextCursor: 'cursor-2',
                prevCursor: undefined,
              },
            ],
            pageParams: ['cursor-prev', ''],
          })),
          refetch: refetchFn,
          native: undefined as unknown,
        }),
      );
      return {
        fn,
        queryFn,
        refetchFn,
        reactiveInfiniteQuery: ReactiveInfiniteQueryFactory({
          getInfiniteQueryOptions: () =>
            infiniteQueryOptions({
              queryKey: ['test'],
              queryFn,
              initialPageParam: '' as string,
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withoutParams.getIdiomatic(queryClient);
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withoutParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        refetchFn,
      };
    },
  },
  withParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (
          params: { filter: string },
          _allOptions?: {
            options?: IdiomaticInfiniteQueryOptions<string>;
            nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
              PageData<string>,
              Error,
              number,
              string[]
            >;
          },
        ) => ({
          pages: [
            {
              data: [`Filtered ${params.filter} Item 1`],
              nextCursor: undefined,
              prevCursor: undefined,
            },
          ],
          pageParams: [''],
        }),
      );
      const queryFn = vi.fn((args: { filter: string }) => {
        fn(args);
        return Promise.resolve({
          data: [`Filtered ${args.filter} Item 1`],
          nextCursor: 'cursor-2',
          prevCursor: undefined,
        });
      });
      return {
        fn,
        queryFn,
        idiomaticInfiniteQuery: IdiomaticInfiniteQueryFactory({
          queryClient,
          getInfiniteQueryOptions: (args: { filter: string }) =>
            infiniteQueryOptions({
              queryKey: ['test', args.filter],
              queryFn: () => queryFn(args),
              initialPageParam: '',
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getReactive: () => {
      let _params: { filter: string };
      const queryFn = vi.fn((args: { filter: string }) =>
        Promise.resolve({
          data: [`Filtered ${args.filter} Item 1`],
          nextCursor: 'cursor-2',
          prevCursor: undefined,
        }),
      );
      const refetchFn = vi.fn(async () => ({
        pages: [
          {
            data: [`Filtered ${_params.filter} Item 1`],
            nextCursor: 'cursor-2',
            prevCursor: undefined,
          },
        ],
        pageParams: [''],
      }));
      const fn = vi.fn(
        (
          params: { filter: string },
          _allOptions?: {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
              PageData<string>,
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
                  data: [`Filtered ${_params.filter} Item 1`],
                  nextCursor: 'cursor-2',
                  prevCursor: undefined,
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
            fetchNextPage: vi.fn(async () => ({
              pages: [
                {
                  data: [`Filtered ${_params.filter} Item 2`],
                  nextCursor: undefined,
                  prevCursor: undefined,
                },
              ],
              pageParams: ['cursor-2'],
            })),
            fetchPreviousPage: vi.fn(async () => ({
              pages: [
                {
                  data: [`Filtered ${_params.filter} Item 0`],
                  prevCursor: undefined,
                  nextCursor: undefined,
                },
              ],
              pageParams: ['cursor-prev'],
            })),
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      return {
        fn,
        queryFn,
        refetchFn,
        reactiveInfiniteQuery: ReactiveInfiniteQueryFactory({
          getInfiniteQueryOptions: (args: { filter: string }) =>
            infiniteQueryOptions({
              queryKey: ['test', args.filter],
              queryFn: () => queryFn(args),
              initialPageParam: '' as string,
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withParams.getIdiomatic(queryClient);
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        refetchFn,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: (queryClient: QueryClient) => {
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
              prevCursor: undefined,
            },
          ],
          pageParams: [''],
        }),
      );
      const queryFn = vi.fn((args?: { filter: string }) => {
        fn(args);
        return Promise.resolve({
          data: args ? [`Filtered ${args.filter} Item 1`] : ['All Items 1'],
          nextCursor: 'cursor-2',
          prevCursor: undefined,
        });
      });
      return {
        fn,
        queryFn,
        idiomaticInfiniteQuery: IdiomaticInfiniteQueryFactory({
          queryClient,
          getInfiniteQueryOptions: (args?: { filter: string }) =>
            infiniteQueryOptions({
              queryKey: args?.filter ? ['test', args.filter] : ['test'],
              queryFn: () => queryFn(args),
              initialPageParam: '',
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getReactive: () => {
      const queryFn = vi.fn((args?: { filter: string }) =>
        Promise.resolve({
          data: args ? [`Filtered ${args.filter} Item 1`] : ['All Items 1'],
          nextCursor: 'cursor-2',
          prevCursor: undefined,
        }),
      );
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
          const refetchFn = vi.fn(async () => ({
            pages: [
              {
                data: capturedParams
                  ? [`Filtered ${capturedParams.filter} Item 1`]
                  : ['All Items 1'],
                nextCursor: 'cursor-2',
                prevCursor: undefined,
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
                  prevCursor: undefined,
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
            fetchNextPage: vi.fn(async () => ({
              pages: [
                {
                  data: capturedParams
                    ? [`Filtered ${capturedParams.filter} Item 2`]
                    : ['All Items 2'],
                  nextCursor: undefined,
                  prevCursor: undefined,
                },
              ],
              pageParams: ['cursor-2'],
            })),
            fetchPreviousPage: vi.fn(async () => ({
              pages: [
                {
                  data: capturedParams
                    ? [`Filtered ${capturedParams.filter} Item 0`]
                    : ['All Items 0'],
                  prevCursor: undefined,
                  nextCursor: undefined,
                },
              ],
              pageParams: ['cursor-prev'],
            })),
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      // Create a shared mock refetch for testing call counts
      const sharedRefetchFn = vi.fn(async () => ({
        pages: [
          { data: ['Item 1'], nextCursor: 'cursor-2', prevCursor: undefined },
        ],
        pageParams: [''],
      }));
      return {
        fn,
        queryFn,
        refetchFn: sharedRefetchFn,
        reactiveInfiniteQuery: ReactiveInfiniteQueryFactory({
          getInfiniteQueryOptions: (args?: { filter: string }) =>
            infiniteQueryOptions({
              queryKey: args?.filter ? ['test', args.filter] : ['test'],
              queryFn: () => queryFn(args),
              initialPageParam: '' as string,
              getNextPageParam: (lastPage: PageData<string>) =>
                lastPage.nextCursor,
              getPreviousPageParam: (firstPage: PageData<string>) =>
                firstPage.prevCursor,
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticInfiniteQuery, fn: idiomaticFn } =
        InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);
      const {
        reactiveInfiniteQuery,
        fn: reactiveFn,
        refetchFn,
      } = InfiniteQueryTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticInfiniteQuery,
        idiomaticFn,
        reactiveInfiniteQuery,
        reactiveFn,
        refetchFn,
      };
    },
  },
};
