import {
  ChimericQuery as CoreChimericQuery,
  DefineChimericQuery as CoreDefineChimericQuery,
} from '@chimeric/core';
import {
  FetchQueryOptions,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

export type ChimericQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreChimericQuery<
  TParams,
  TResult,
  E,
  FetchQueryOptions<TResult, E, TResult, TQueryKey>,
  Omit<UseQueryOptions<TResult, E, TResult, TQueryKey>, 'queryKey' | 'queryFn'>,
  UseQueryResult<TResult, E>
>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineChimericQuery<
  T,
  E,
  FetchQueryOptions<
    Awaited<ReturnType<T>>,
    E,
    Awaited<ReturnType<T>>,
    TQueryKey
  >,
  Omit<
    UseQueryOptions<
      Awaited<ReturnType<T>>,
      E,
      Awaited<ReturnType<T>>,
      TQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
  UseQueryResult<Awaited<ReturnType<T>>, E>
>;
