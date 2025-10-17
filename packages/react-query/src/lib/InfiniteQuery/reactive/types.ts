import {
  ReactiveInfiniteQuery as CoreReactiveInfiniteQuery,
  DefineReactiveInfiniteQuery as CoreDefineReactiveInfiniteQuery,
} from '@chimeric/core';

import {
  type UseInfiniteQueryResult,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';

export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveNativeOptions<TPageData, TError, TPageParam, TQueryKey>,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

export type DefineReactiveInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineReactiveInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveNativeOptions<TPageData, TError, TPageParam, TQueryKey>,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

export type TanstackInfiniteQueryReactiveNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseInfiniteQueryOptions<
    TPageData,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TPageData,
    TQueryKey,
    TPageParam
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'getPreviousPageParam'
>;

export type TanstackInfiniteQueryReactiveReturnType<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
> = UseInfiniteQueryResult<InfiniteData<TPageData, TPageParam>, TError>;