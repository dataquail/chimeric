import {
  IdiomaticInfiniteQuery as CoreIdiomaticInfiniteQuery,
  DefineIdiomaticInfiniteQuery as CoreDefineIdiomaticInfiniteQuery,
} from '@chimeric/core';

import {
  type QueryKey,
  type FetchInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/svelte-query';

export type IdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreIdiomaticInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  SvelteInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
>;

export type DefineIdiomaticInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineIdiomaticInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  SvelteInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
>;

export type SvelteInfiniteQueryIdiomaticNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchInfiniteQueryOptions<
    InfiniteData<TPageData, TPageParam>,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TQueryKey
  >,
  'queryKey' | 'queryFn'
>;
