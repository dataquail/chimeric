import {
  IdiomaticQuery as CoreIdiomaticQuery,
  DefineIdiomaticQuery as CoreDefineIdiomaticQuery,
} from '@chimeric/core';

import { type QueryKey, type FetchQueryOptions } from '@tanstack/react-query';

export type IdiomaticQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreIdiomaticQuery<
  TParams,
  TResult,
  Omit<
    FetchQueryOptions<TResult, E, TResult, TQueryKey>,
    'queryKey' | 'queryFn'
  >
>;

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineIdiomaticQuery<
  T,
  Omit<
    FetchQueryOptions<
      Awaited<ReturnType<T>>,
      E,
      Awaited<ReturnType<T>>,
      TQueryKey
    >,
    'queryKey' | 'queryFn'
  >
>;

export type TanstackQueryIdiomaticNativeOptions<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchQueryOptions<TResult, E, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;
