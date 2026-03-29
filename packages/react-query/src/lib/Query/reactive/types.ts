import {
  ReactiveQuery as CoreReactiveQuery,
  DefineReactiveQuery as CoreDefineReactiveQuery,
} from '@chimeric/core';

import {
  type UseQueryResult,
  type QueryKey,
  type UseQueryOptions,
  type FetchQueryOptions,
} from '@tanstack/react-query';

export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveQuery<
  TParams,
  TResult,
  TError,
  TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<TResult, TError>,
  TanstackQueryReactivePrefetchNativeOptions<TResult, TError, TQueryKey>
>;

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineReactiveQuery<
  T,
  TError,
  TanstackQueryReactiveNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<Awaited<ReturnType<T>>, TError>,
  TanstackQueryReactivePrefetchNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >
>;

export type TanstackQueryReactiveNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export type TanstackQueryReactiveReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = UseQueryResult<TResult, TError>;

export type TanstackQueryReactivePrefetchNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;
