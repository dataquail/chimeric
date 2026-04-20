import { ChimericInfiniteQuery as CoreChimericInfiniteQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/svelte-query';
import { SvelteInfiniteQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  ReactiveInfiniteQuery,
  SvelteInfiniteQueryReactiveNativeOptions,
  SvelteInfiniteQueryReactivePrefetchNativeOptions,
  SvelteInfiniteQueryReactiveReturnType,
} from '../reactive/types';

export type ChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  SvelteInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
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

export type DefineChimericInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Parameters<T> extends []
  ? ChimericInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>
  : ChimericInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TQueryKey
    >;

export type { ReactiveInfiniteQuery };
