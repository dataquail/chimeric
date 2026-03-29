import {
  createReactiveQuery as coreCreateReactiveQuery,
  ReactiveQueryReturn,
  ReactiveQueryOptions,
} from '@chimeric/core';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactivePrefetchNativeOptions,
  TanstackQueryReactiveReturnType,
} from './types';
import { QueryKey } from '@tanstack/react-query';

// Overload for no params
export function createReactiveQuery<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveQueryOptions;
    nativeOptions?: TanstackQueryReactiveNativeOptions<
      TResult,
      TError,
      TQueryKey
    >;
  }) => ReactiveQueryReturn<
    TResult,
    TError,
    TanstackQueryReactiveReturnType<TResult, TError>
  >,
  usePrefetchHookFn: (allOptions?: {
    nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
      TResult,
      TError,
      TQueryKey
    >;
  }) => void,
): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Overload for optional params
export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => ReactiveQueryReturn<
    TResult,
    TError,
    TanstackQueryReactiveReturnType<TResult, TError>
  >,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Overload for required params
export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => ReactiveQueryReturn<
    TResult,
    TError,
    TanstackQueryReactiveReturnType<TResult, TError>
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Implementation
export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => ReactiveQueryReturn<
    TResult,
    TError,
    TanstackQueryReactiveReturnType<TResult, TError>
  >,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => void,
): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateReactiveQuery(reactiveFn, usePrefetchHookFn) as ReactiveQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
