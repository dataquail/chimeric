import {
  type QueryKey,
  useInfiniteQuery,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import {
  TanstackInfiniteQueryReactiveNativeOptions,
  type ReactiveInfiniteQuery,
} from './types';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';
import { validateMaxArgLength } from '../../utilities/validateMaxArgLength';
import { ReactiveInfiniteQueryOptions } from '@chimeric/core';

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
}: {
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
      >['use']
    >[0],
    maybeOptions?: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['use']
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
            nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackInfiniteQueryReactiveNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;
    const query = useInfiniteQuery({
      ...getInfiniteQueryOptions(params as TParams),
      enabled: allOptions?.options?.enabled ?? true,
      ...nativeOptions,
    });

    return {
      isIdle: !query.isFetched,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: query.data
        ? {
            pages: query.data.pages,
            pageParams: query.data.pageParams,
          }
        : undefined,
      isFetchingNextPage: query.isFetchingNextPage,
      isFetchingPreviousPage: query.isFetchingPreviousPage,
      hasNextPage: query.hasNextPage ?? false,
      hasPreviousPage: query.hasPreviousPage ?? false,
      fetchNextPage: async () => {
        const result = await query.fetchNextPage();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      fetchPreviousPage: async () => {
        const result = await query.fetchPreviousPage();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      refetch: async () => {
        const result = await query.refetch();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      native: query,
    } as ReturnType<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['use']
    >;
  };

  return createReactiveInfiniteQuery(query) as ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
