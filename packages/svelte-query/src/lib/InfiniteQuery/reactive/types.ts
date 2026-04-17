import {
  ReactiveInfiniteQuery as CoreReactiveInfiniteQuery,
  DefineReactiveInfiniteQuery as CoreDefineReactiveInfiniteQuery,
} from '@chimeric/core';

import {
  type QueryKey,
  type CreateInfiniteQueryOptions,
  type CreateInfiniteQueryResult,
  type FetchInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/svelte-query';

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
  SvelteInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>,
  SvelteInfiniteQueryReactivePrefetchNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
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
  SvelteInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>,
  SvelteInfiniteQueryReactivePrefetchNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
>;

export type SvelteInfiniteQueryReactiveNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  CreateInfiniteQueryOptions<
    TPageData,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TQueryKey,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getNextPageParam'
  | 'getPreviousPageParam'
>;

export type SvelteInfiniteQueryReactiveReturnType<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
> = CreateInfiniteQueryResult<InfiniteData<TPageData, TPageParam>, TError>;

export type SvelteInfiniteQueryReactivePrefetchNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchInfiniteQueryOptions<
    TPageData,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TQueryKey,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getNextPageParam'
  | 'getPreviousPageParam'
>;
