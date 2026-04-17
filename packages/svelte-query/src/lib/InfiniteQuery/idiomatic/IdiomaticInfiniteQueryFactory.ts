/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type QueryKey,
  infiniteQueryOptions,
  type QueryClient,
  type InfiniteData,
} from '@tanstack/svelte-query';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';
import {
  IdiomaticInfiniteQuery,
  SvelteInfiniteQueryIdiomaticNativeOptions,
} from './types';
import {
  IdiomaticInfiniteQueryOptions,
  validateMaxArgLength,
} from '@chimeric/core';

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
  getInfiniteQueryOptions: any;
}): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getInfiniteQueryOptions,
    fnName: 'getInfiniteQueryOptions',
    maximumLength: 1,
  });

  const idiomaticInfiniteQuery = async (
    paramsOrOptions?: any,
    maybeOptions?: any,
  ) => {
    const params =
      getInfiniteQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getInfiniteQueryOptions.length === 0
        ? (paramsOrOptions as {
            options?: IdiomaticInfiniteQueryOptions<TPageParam>;
            nativeOptions?: SvelteInfiniteQueryIdiomaticNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;
    const infiniteOptions = getInfiniteQueryOptions(params as TParams);

    const fetchOptions: any = {
      ...infiniteOptions,
      ...nativeOptions,
    };

    if (allOptions?.options?.forceRefetch) {
      fetchOptions.staleTime = 0;
    }

    if (allOptions?.options?.pageParam) {
      fetchOptions.initialPageParam = allOptions.options.pageParam;
    }

    const result = (await queryClient.fetchInfiniteQuery(fetchOptions)) as InfiniteData<TPageData, TPageParam>;

    return {
      pages: result.pages as TPageData[],
      pageParams: result.pageParams as TPageParam[],
    };
  };

  const prefetch = async (paramsOrOptions?: any, maybeOptions?: any) => {
    const params =
      getInfiniteQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getInfiniteQueryOptions.length === 0
        ? (paramsOrOptions as {
            nativeOptions?: SvelteInfiniteQueryIdiomaticNativeOptions<
              TPageData,
              TError,
              TPageParam,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >
      | undefined;
    const infiniteOptions = getInfiniteQueryOptions(params as TParams);

    await queryClient.prefetchInfiniteQuery({
      ...infiniteOptions,
      ...nativeOptions,
    } as any);
  };

  return createIdiomaticInfiniteQuery(
    idiomaticInfiniteQuery as any,
    prefetch as any,
  ) as IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
