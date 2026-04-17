import {
  createReactiveInfiniteQuery as coreCreateReactiveInfiniteQuery,
  ReactiveInfiniteQueryResult,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import {
  ReactiveInfiniteQuery,
  SvelteInfiniteQueryReactiveNativeOptions,
  SvelteInfiniteQueryReactivePrefetchNativeOptions,
  SvelteInfiniteQueryReactiveReturnType,
} from './types';
import { QueryKey } from '@tanstack/svelte-query';

// No params
export function createReactiveInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveInfiniteQueryOptions;
    nativeOptions?: SvelteInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >;
  }) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (allOptions?: {
    nativeOptions?: SvelteInfiniteQueryReactivePrefetchNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >;
  }) => void,
): ReactiveInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveInfiniteQueryOptions;
      nativeOptions?: SvelteInfiniteQueryReactiveNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: SvelteInfiniteQueryReactivePrefetchNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// Required params
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveInfiniteQueryOptions;
      nativeOptions?: SvelteInfiniteQueryReactiveNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: SvelteInfiniteQueryReactivePrefetchNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveInfiniteQueryOptions;
      nativeOptions?: SvelteInfiniteQueryReactiveNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    SvelteInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: SvelteInfiniteQueryReactivePrefetchNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  return coreCreateReactiveInfiniteQuery(
    reactiveFn,
    usePrefetchHookFn,
  ) as ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;
}
