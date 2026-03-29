import {
  createReactiveInfiniteQuery as coreCreateReactiveInfiniteQuery,
  ReactiveInfiniteQueryResult,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import {
  ReactiveInfiniteQuery,
  TanstackInfiniteQueryReactiveNativeOptions,
  TanstackInfiniteQueryReactivePrefetchNativeOptions,
  TanstackInfiniteQueryReactiveReturnType,
} from './types';
import { QueryKey } from '@tanstack/react-query';

// No params
export function createReactiveInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveInfiniteQueryOptions;
    nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >;
  }) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (allOptions?: {
    nativeOptions?: TanstackInfiniteQueryReactivePrefetchNativeOptions<
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
      nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
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
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryReactivePrefetchNativeOptions<
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
      nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
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
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryReactivePrefetchNativeOptions<
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
      nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
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
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryReactivePrefetchNativeOptions<
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
