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
    TanstackInfiniteQueryReactiveNativeOptions<TPageData, TError, TPageParam, TQueryKey>,
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