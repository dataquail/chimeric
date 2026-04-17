/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type QueryKey,
  createInfiniteQuery,
  infiniteQueryOptions,
  type QueryClient,
  type InfiniteData,
  type FetchInfiniteQueryOptions,
} from '@tanstack/svelte-query';
import {
  SvelteInfiniteQueryReactiveNativeOptions,
  SvelteInfiniteQueryReactivePrefetchNativeOptions,
  type ReactiveInfiniteQuery,
} from './types';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';
import { ReactiveInfiniteQueryOptions, validateMaxArgLength } from '@chimeric/core';

// Required params
export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: (
    params: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
  queryClient?: QueryClient;
}): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: (
    params?: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
  queryClient?: QueryClient;
}): ReactiveInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// No params
export function ReactiveInfiniteQueryFactory<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: () => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
  queryClient?: QueryClient;
}): ReactiveInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getInfiniteQueryOptions,
  queryClient,
}: {
  getInfiniteQueryOptions: any;
  queryClient?: QueryClient;
}): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getInfiniteQueryOptions,
    fnName: 'getInfiniteQueryOptions',
    maximumLength: 1,
  });

  const query = (
    paramsOrOptions?: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['useHook']
    >[0],
    maybeOptions?: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['useHook']
    >[1],
  ) => {
    const params =
      getInfiniteQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getInfiniteQueryOptions.length === 0
        ? (paramsOrOptions as {
            options?: ReactiveInfiniteQueryOptions;
            nativeOptions?: SvelteInfiniteQueryReactiveNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteInfiniteQueryReactiveNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;

    const result = createInfiniteQuery(
      () => ({
        ...getInfiniteQueryOptions(params),
        enabled: allOptions?.options?.enabled ?? true,
        ...nativeOptions,
      }),
      queryClient ? () => queryClient : undefined,
    );

    return {
      get isIdle() {
        return !result.isFetched;
      },
      get isPending() {
        return result.isPending;
      },
      get isSuccess() {
        return result.isSuccess;
      },
      get isError() {
        return result.isError;
      },
      get error() {
        return result.error as TError | null;
      },
      get data() {
        return result.data
          ? {
              pages: result.data.pages as TPageData[],
              pageParams: result.data.pageParams as TPageParam[],
            }
          : undefined;
      },
      get isFetchingNextPage() {
        return result.isFetchingNextPage;
      },
      get isFetchingPreviousPage() {
        return result.isFetchingPreviousPage;
      },
      get hasNextPage() {
        return result.hasNextPage ?? false;
      },
      get hasPreviousPage() {
        return result.hasPreviousPage ?? false;
      },
      fetchNextPage: async () => {
        const r = await result.fetchNextPage();
        return {
          pages: (r.data?.pages ?? []) as TPageData[],
          pageParams: (r.data?.pageParams ?? []) as TPageParam[],
        };
      },
      fetchPreviousPage: async () => {
        const r = await result.fetchPreviousPage();
        return {
          pages: (r.data?.pages ?? []) as TPageData[],
          pageParams: (r.data?.pageParams ?? []) as TPageParam[],
        };
      },
      refetch: async () => {
        const r = await result.refetch();
        return {
          pages: (r.data?.pages ?? []) as TPageData[],
          pageParams: (r.data?.pageParams ?? []) as TPageParam[],
        };
      },
      get native() {
        return result;
      },
    } as ReturnType<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['useHook']
    >;
  };

  const prefetchHook = (
    paramsOrOptions?: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['usePrefetchHook']
    >[0],
    maybeOptions?: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['usePrefetchHook']
    >[1],
  ) => {
    const params =
      getInfiniteQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getInfiniteQueryOptions.length === 0
        ? (paramsOrOptions as {
            nativeOptions?: SvelteInfiniteQueryReactivePrefetchNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteInfiniteQueryReactivePrefetchNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;

    void queryClient?.prefetchInfiniteQuery({
      ...getInfiniteQueryOptions(params),
      ...nativeOptions,
    } as FetchInfiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData, TPageParam>,
      TQueryKey,
      TPageParam
    >);
  };

  return createReactiveInfiniteQuery(
    query,
    prefetchHook,
  ) as ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;
}
