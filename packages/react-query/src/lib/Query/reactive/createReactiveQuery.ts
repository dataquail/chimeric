import {
  createReactiveQuery as coreCreateReactiveQuery,
  ReactiveQueryReturn,
  ReactiveQueryOptions,
} from '@chimeric/core';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactiveReturnType,
} from './types';
import { QueryKey } from '@tanstack/react-query';

// Overload for no params (allOptions as first arg)
export function createReactiveQuery<
  TResult,
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
): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Overload for optional params (params as first arg, allOptions as second)
export function createReactiveQuery<
  TParams,
  TResult,
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
): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Overload for required params (params as first arg, allOptions as second)
export function createReactiveQuery<
  TParams,
  TResult,
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
): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateReactiveQuery(reactiveFn) as ReactiveQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
