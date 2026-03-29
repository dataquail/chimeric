import {
  IdiomaticInfiniteQuery,
  TanstackInfiniteQueryIdiomaticNativeOptions,
} from './types';
import { QueryKey } from '@tanstack/react-query';
import {
  createIdiomaticInfiniteQuery as coreCreateIdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  IdiomaticInfiniteQueryResult,
} from '@chimeric/core';

// No params
export function createIdiomaticInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (allOptions?: {
    options?: IdiomaticInfiniteQueryOptions<TPageParam>;
    nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >;
  }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (allOptions?: {
    nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >;
  }) => Promise<void>,
): IdiomaticInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params?: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<void>,
): IdiomaticInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// Required params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<void>,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
        TPageData,
        TError,
        TPageParam,
        TQueryKey
      >;
    },
  ) => Promise<void>,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  return coreCreateIdiomaticInfiniteQuery(
    idiomaticFn,
    prefetchFn,
  ) as IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
