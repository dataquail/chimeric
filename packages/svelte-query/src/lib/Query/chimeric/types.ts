import {
  ChimericQuery as CoreChimericQuery,
  DefineChimericQuery as CoreDefineChimericQuery,
} from '@chimeric/core';
import { QueryKey } from '@tanstack/svelte-query';
import { SvelteQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  SvelteQueryReactiveNativeOptions,
  SvelteQueryReactivePrefetchNativeOptions,
  SvelteQueryReactiveReturnType,
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
  SvelteQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>,
  SvelteQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
  SvelteQueryReactiveReturnType<TResult, TError>,
  SvelteQueryReactivePrefetchNativeOptions<TResult, TError, TQueryKey>
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
  SvelteQueryIdiomaticNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >,
  SvelteQueryReactiveNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>,
  SvelteQueryReactiveReturnType<Awaited<ReturnType<T>>, TError>,
  SvelteQueryReactivePrefetchNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >
>;
