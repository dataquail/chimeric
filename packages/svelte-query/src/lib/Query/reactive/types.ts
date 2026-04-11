import {
  ReactiveQuery as CoreReactiveQuery,
  DefineReactiveQuery as CoreDefineReactiveQuery,
} from '@chimeric/core';

import {
  type CreateQueryResult,
  type QueryKey,
  type CreateQueryOptions,
  type FetchQueryOptions,
} from '@tanstack/svelte-query';

export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveQuery<
  TParams,
  TResult,
  TError,
  SvelteQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
  SvelteQueryReactiveReturnType<TResult, TError>,
  SvelteQueryReactivePrefetchNativeOptions<TResult, TError, TQueryKey>
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
  SvelteQueryReactiveNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>,
  SvelteQueryReactiveReturnType<Awaited<ReturnType<T>>, TError>,
  SvelteQueryReactivePrefetchNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >
>;

export type SvelteQueryReactiveNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  CreateQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export type SvelteQueryReactiveReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = CreateQueryResult<TResult, TError>;

export type SvelteQueryReactivePrefetchNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;
