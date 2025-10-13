/* eslint-disable @typescript-eslint/no-explicit-any */
import { type QueryKey, useQuery, queryOptions } from '@tanstack/react-query';
import {
  TanstackQueryReactiveNativeOptions,
  type ReactiveQuery,
} from './types';
import { createReactiveQuery } from './createReactiveQuery';
import { ReactiveQueryOptions } from '@chimeric/core';
import { validateMaxArgLength } from '../../utilities/validateMaxArgLength';

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
  const query = (
    paramsOrOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['use']
    >[0],
    maybeOptions?: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['use']
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
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>
      | undefined;
    const query = useQuery({
      ...getQueryOptions(params),
      enabled: allOptions?.options?.enabled ?? true,
      ...nativeOptions,
    });

    return {
      isIdle: !query.isFetched,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: query.data,
      refetch: async () => (await query.refetch()).data as TResult,
      native: query,
    } as ReturnType<ReactiveQuery<TParams, TResult, TError, TQueryKey>['use']>;
  };

  return createReactiveQuery(query) as ReactiveQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
