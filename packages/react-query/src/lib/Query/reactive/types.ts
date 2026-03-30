import {
  ReactiveQuery as CoreReactiveQuery,
  DefineReactiveQuery as CoreDefineReactiveQuery,
} from '@chimeric/core';

import {
  type UseQueryResult,
  type UseSuspenseQueryResult,
  type QueryKey,
  type UseQueryOptions,
  type UseSuspenseQueryOptions,
  type FetchQueryOptions,
} from '@tanstack/react-query';

export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveQuery<
  TParams,
  TResult,
  TError,
  TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<TResult, TError>,
  TanstackQueryReactivePrefetchNativeOptions<TResult, TError, TQueryKey>
> &
  ReactiveQuerySuspense<
    TParams,
    TResult,
    TError,
    TanstackQueryReactiveSuspenseNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveSuspenseReturnType<TResult, TError>
  >;

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineReactiveQuery<
  T,
  TError,
  TanstackQueryReactiveNativeOptions<Awaited<ReturnType<T>>, TError, TQueryKey>,
  TanstackQueryReactiveReturnType<Awaited<ReturnType<T>>, TError>,
  TanstackQueryReactivePrefetchNativeOptions<
    Awaited<ReturnType<T>>,
    TError,
    TQueryKey
  >
> &
  ReactiveQuerySuspense<
    Parameters<T> extends [] ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError,
    TanstackQueryReactiveSuspenseNativeOptions<
      Awaited<ReturnType<T>>,
      TError,
      TQueryKey
    >,
    TanstackQueryReactiveSuspenseReturnType<Awaited<ReturnType<T>>, TError>
  >;

export type ReactiveQuerySuspenseReturn<TResult, TNativeReturnType> = {
  isPending: false;
  isSuccess: boolean;
  isError: boolean;
  error: null;
  data: TResult;
  refetch: () => Promise<TResult>;
  native: TNativeReturnType;
};

export type ReactiveQuerySuspense<
  TParams = void,
  TResult = unknown,
  _TError extends Error = Error,
  TNativeSuspenseOptions = unknown,
  TNativeSuspenseReturnType = unknown,
> = [TParams] extends [void]
  ? {
      useSuspenseHook: (allOptions?: {
        nativeOptions?: TNativeSuspenseOptions;
      }) => ReactiveQuerySuspenseReturn<TResult, TNativeSuspenseReturnType>;
    }
  : [TParams] extends [undefined]
  ? {
      useSuspenseHook: (allOptions?: {
        nativeOptions?: TNativeSuspenseOptions;
      }) => ReactiveQuerySuspenseReturn<TResult, TNativeSuspenseReturnType>;
    }
  : undefined extends TParams
  ? {
      useSuspenseHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          nativeOptions?: TNativeSuspenseOptions;
        },
      ) => ReactiveQuerySuspenseReturn<TResult, TNativeSuspenseReturnType>;
    }
  : {
      useSuspenseHook: (
        params: TParams,
        allOptions?: {
          nativeOptions?: TNativeSuspenseOptions;
        },
      ) => ReactiveQuerySuspenseReturn<TResult, TNativeSuspenseReturnType>;
    };

export type TanstackQueryReactiveNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export type TanstackQueryReactiveReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = UseQueryResult<TResult, TError>;

export type TanstackQueryReactiveSuspenseNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseSuspenseQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;

export type TanstackQueryReactiveSuspenseReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = UseSuspenseQueryResult<TResult, TError>;

export type TanstackQueryReactivePrefetchNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchQueryOptions<TResult, TError, TResult, TQueryKey>,
  'queryKey' | 'queryFn'
>;
