import {
  type QueryKey,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { type ReactiveInfiniteQuery } from './types';
import { throwReactiveServerError } from '../../serverErrors';

// Required params
export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: (
    params: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
}): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: (
    params?: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
}): ReactiveInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// No params
export function ReactiveInfiniteQueryFactory<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getInfiniteQueryOptions: () => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
}): ReactiveInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function ReactiveInfiniteQueryFactory(
   
  _config: { getInfiniteQueryOptions: unknown },
): never {
  throwReactiveServerError('ReactiveInfiniteQueryFactory');
}
