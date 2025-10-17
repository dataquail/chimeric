import {
  createReactiveInfiniteQuery as coreCreateReactiveInfiniteQuery,
  ReactiveInfiniteQuery as CoreReactiveInfiniteQuery,
} from '@chimeric/core';
import {
  ReactiveInfiniteQuery,
  TanstackInfiniteQueryReactiveNativeOptions,
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
  reactiveFn: CoreReactiveInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >['use'],
): ReactiveInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: CoreReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >['use'],
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
  reactiveFn: CoreReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >['use'],
): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: CoreReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >['use'],
): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  return coreCreateReactiveInfiniteQuery(reactiveFn) as ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
