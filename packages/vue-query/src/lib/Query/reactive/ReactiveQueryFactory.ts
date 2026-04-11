/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue';
import {
  type QueryKey,
  type FetchQueryOptions,
  useQuery,
} from '@tanstack/vue-query';
import {
  VueQueryReactiveNativeOptions,
  VueQueryReactivePrefetchNativeOptions,
  type ReactiveQuery,
} from './types';
import { markReactive, TYPE_MARKERS, validateMaxArgLength } from '@chimeric/core';

// Required params (must come first - most specific)
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params: TParams,
  ) => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Optional params
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params?: TParams,
  ) => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params
export function ReactiveQueryFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: () => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
}: {
  getQueryOptions: any;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getQueryOptions,
    fnName: 'getQueryOptions',
    maximumLength: 1,
  });

  const useHookFn = (
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
            options?: { enabled?: boolean };
            nativeOptions?: VueQueryReactiveNativeOptions<TResult, TError>;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | VueQueryReactiveNativeOptions<TResult, TError>
      | undefined;

    const query = useQuery({
      ...getQueryOptions(params),
      enabled: allOptions?.options?.enabled ?? true,
      ...nativeOptions,
    } as any);

    return {
      isIdle: computed(() => !query.isFetched.value),
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: query.data,
      refetch: async () => {
        const result = await query.refetch();
        return (result.data as { value: unknown }).value as TResult;
      },
      native: query,
    };
  };

  const usePrefetchHookFn = (
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
            nativeOptions?: VueQueryReactivePrefetchNativeOptions<TResult, TError>;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions;

    // For Vue Query, we use the queryClient directly for prefetching
    // This is a no-op in the reactive context; use idiomatic prefetch instead
    void params;
    void nativeOptions;
  };

  const reactiveQuery = {
    useHook: useHookFn,
    usePrefetchHook: usePrefetchHookFn,
  };

  return markReactive(
    reactiveQuery,
    TYPE_MARKERS.REACTIVE_QUERY,
  ) as ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}
