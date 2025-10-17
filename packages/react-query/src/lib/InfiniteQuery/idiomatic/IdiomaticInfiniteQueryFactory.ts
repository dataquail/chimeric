import {
  QueryKey,
  infiniteQueryOptions,
  type QueryClient,
  type InfiniteData,
  type FetchInfiniteQueryOptions,
} from '@tanstack/react-query';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';
import {
  IdiomaticInfiniteQuery,
  TanstackInfiniteQueryIdiomaticNativeOptions,
} from './types';
import { validateMaxArgLength } from '../../utilities/validateMaxArgLength';
import { IdiomaticInfiniteQueryOptions } from '@chimeric/core';

// Required params
export function IdiomaticInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
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
}): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function IdiomaticInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
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
}): IdiomaticInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// No params
export function IdiomaticInfiniteQueryFactory<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getInfiniteQueryOptions: () => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
}): IdiomaticInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function IdiomaticInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getInfiniteQueryOptions,
}: {
  queryClient: QueryClient;
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
}): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getInfiniteQueryOptions,
    fnName: 'getInfiniteQueryOptions',
    maximumLength: 1,
  });
  const idiomaticInfiniteQuery = async (
    paramsOrOptions?: Parameters<
      IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>
    >[0],
    maybeOptions?: Parameters<
      IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>
    >[1],
  ) => {
    const params =
      getInfiniteQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getInfiniteQueryOptions.length === 0
        ? (paramsOrOptions as {
            options?: IdiomaticInfiniteQueryOptions;
            nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;
    const infiniteOptions = getInfiniteQueryOptions(params as TParams);

    const fetchOptions: FetchInfiniteQueryOptions<
      InfiniteData<TPageData, TPageParam>,
      TError,
      TPageData,
      TQueryKey,
      TPageParam
    > = {
      ...infiniteOptions,
      ...nativeOptions,
    } as FetchInfiniteQueryOptions<
      InfiniteData<TPageData, TPageParam>,
      TError,
      TPageData,
      TQueryKey,
      TPageParam
    >;

    if (allOptions?.options?.forceRefetch) {
      fetchOptions.staleTime = 0;
    }

    if (allOptions?.options?.pageParam) {
      fetchOptions.initialPageParam = allOptions.options
        .pageParam as TPageParam;
    }

    const result = await queryClient.fetchInfiniteQuery(fetchOptions);

    return {
      pages: result.pages,
      pageParams: result.pageParams,
    };
  };

  return createIdiomaticInfiniteQuery(
    idiomaticInfiniteQuery as IdiomaticInfiniteQuery<
      TParams,
      TPageData,
      TPageParam,
      TError,
      TQueryKey
    >,
  ) as IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
