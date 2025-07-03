import {
  ChimericQuery as CoreChimericQuery,
  DefineChimericQuery as CoreDefineChimericQuery,
} from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';
import { TanstackQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactiveReturnType,
} from '../reactive/types';

export type ChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreChimericQuery<
  TParams,
  TResult,
  TError,
  TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>,
  TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<TResult, TError>
>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineChimericQuery<
  T,
  TError,
  TanstackQueryIdiomaticNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >,
  TanstackQueryReactiveNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<Awaited<ReturnType<T>>, TError>
>;
