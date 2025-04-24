import {
  ReactiveQuery as CoreReactiveQuery,
  DefineReactiveQuery as CoreDefineReactiveQuery,
} from '@chimeric/core';

import {
  type UseQueryResult,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';

export type ReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveQuery<
  TParams,
  TResult,
  E,
  Omit<UseQueryOptions<TResult, E, TResult, TQueryKey>, 'queryKey' | 'queryFn'>,
  UseQueryResult<TResult, E>
>;

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineReactiveQuery<
  T,
  E,
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
