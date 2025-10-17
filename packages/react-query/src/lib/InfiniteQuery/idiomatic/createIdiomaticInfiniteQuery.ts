import { IdiomaticInfiniteQuery } from './types';
import { QueryKey } from '@tanstack/react-query';
import { createIdiomaticInfiniteQuery as coreCreateIdiomaticInfiniteQuery } from '@chimeric/core';

// Optional params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): IdiomaticInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;
// No params
export function createIdiomaticInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): IdiomaticInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Required params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  return coreCreateIdiomaticInfiniteQuery(
    idiomaticFn,
  ) as IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
