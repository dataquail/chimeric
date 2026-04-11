/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type QueryKey,
  createQuery,
  queryOptions,
  type QueryClient,
} from '@tanstack/svelte-query';
import {
  SvelteQueryReactiveNativeOptions,
  SvelteQueryReactivePrefetchNativeOptions,
  type ReactiveQuery,
} from './types';
import { createReactiveQuery } from './createReactiveQuery';
import { ReactiveQueryOptions, validateMaxArgLength } from '@chimeric/core';

// Required params (must come first - most specific)
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
  queryClient?: QueryClient;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
  queryClient?: QueryClient;
}): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function ReactiveQueryFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, TError, TResult, TQueryKey>
  >;
  queryClient?: QueryClient;
}): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
  queryClient,
}: {
  getQueryOptions: any;
  queryClient?: QueryClient;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getQueryOptions,
    fnName: 'getQueryOptions',
    maximumLength: 1,
  });
  const query = (
    paramsOrOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['useHook']
    >[0],
    maybeOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['useHook']
    >[1],
  ) => {
    const params =
      getQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getQueryOptions.length === 0
        ? (paramsOrOptions as {
            options?: ReactiveQueryOptions;
            nativeOptions?: SvelteQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteQueryReactiveNativeOptions<TResult, TError, TQueryKey>
      | undefined;

    const result = createQuery(
      () => ({
        ...getQueryOptions(params),
        enabled: allOptions?.options?.enabled ?? true,
        ...nativeOptions,
      }),
      queryClient ? () => queryClient : undefined,
    );

    return {
      get isIdle() {
        return !result.isFetched;
      },
      get isPending() {
        return result.isPending;
      },
      get isSuccess() {
        return result.isSuccess;
      },
      get isError() {
        return result.isError;
      },
      get error() {
        return result.error as TError | null;
      },
      get data() {
        return result.data as TResult | undefined;
      },
      refetch: async () => (await result.refetch()).data as TResult,
      get native() {
        return result;
      },
    } as ReturnType<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['useHook']
    >;
  };

  const prefetchHook = (
    paramsOrOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['usePrefetchHook']
    >[0],
    maybeOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['usePrefetchHook']
    >[1],
  ) => {
    const params =
      getQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getQueryOptions.length === 0
        ? (paramsOrOptions as {
            nativeOptions?: SvelteQueryReactivePrefetchNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | SvelteQueryReactivePrefetchNativeOptions<TResult, TError, TQueryKey>
      | undefined;

    // In svelte-query, prefetch is done imperatively via queryClient
    void queryClient?.prefetchQuery({
      ...getQueryOptions(params),
      ...nativeOptions,
    });
  };

  return createReactiveQuery(
    query,
    prefetchHook,
  ) as ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}
