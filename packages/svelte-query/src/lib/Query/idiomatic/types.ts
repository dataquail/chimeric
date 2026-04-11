import {
  IdiomaticQuery as CoreIdiomaticQuery,
  DefineIdiomaticQuery as CoreDefineIdiomaticQuery,
} from '@chimeric/core';

import { type QueryKey, type FetchQueryOptions } from '@tanstack/svelte-query';

export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreIdiomaticQuery<
  TParams,
  TResult,
  SvelteQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
>;

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineIdiomaticQuery<
  T,
  SvelteQueryIdiomaticNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>
>;

export type SvelteQueryIdiomaticNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;
