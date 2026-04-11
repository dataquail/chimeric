import {
  IdiomaticQuery as CoreIdiomaticQuery,
  ChimericQuery as CoreChimericQuery,
} from '@chimeric/core';
import { QueryKey } from '@tanstack/vue-query';
import { TanstackQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  ReactiveQuery,
} from '../reactive/types';

// ChimericQuery for vue-query combines an idiomatic function-call interface
// with a Vue reactive composable interface
export type ChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreIdiomaticQuery<
  TParams,
  TResult,
  TanstackQueryIdiomaticNativeOptions<TResult, TError>
> &
  ReactiveQuery<TParams, TResult, TError, TQueryKey>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Parameters<T> extends []
  ? ChimericQuery<void, Awaited<ReturnType<T>>, TError, TQueryKey>
  : ChimericQuery<Parameters<T>[0], Awaited<ReturnType<T>>, TError, TQueryKey>;

// Ensure we export the core types used for compatibility
export type { CoreChimericQuery };
