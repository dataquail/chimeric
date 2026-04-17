import { IdiomaticQuery as CoreIdiomaticQuery } from '@chimeric/core';
import { FetchQueryOptions, QueryKey } from '@tanstack/vue-query';

export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  _TQueryKey extends QueryKey = QueryKey,
> = CoreIdiomaticQuery<
  TParams,
  TResult,
  TanstackQueryIdiomaticNativeOptions<TResult, TError>
>;

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Parameters<T> extends []
  ? IdiomaticQuery<void, Awaited<ReturnType<T>>, TError, TQueryKey>
  : IdiomaticQuery<Parameters<T>[0], Awaited<ReturnType<T>>, TError, TQueryKey>;

export type TanstackQueryIdiomaticNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
> = Omit<FetchQueryOptions<TResult, TError, TResult, QueryKey>, 'queryKey' | 'queryFn'>;
