import { type QueryKey, useQuery, queryOptions } from '@tanstack/react-query';
import { type ReactiveQuery } from './types';
import { createReactiveQuery } from './createReactiveQuery';

// Overloads
export function ReactiveQueryFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, E, TResult, TQueryKey>
  >,
): ReactiveQuery<undefined, TResult, E, TQueryKey>;
export function ReactiveQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): ReactiveQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function ReactiveQueryFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): ReactiveQuery<TParams, TResult, E, TQueryKey> {
  return createReactiveQuery((paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const query = useQuery({
      ...getQueryOptions(params as TParams),
      enabled: options?.enabled ?? true,
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
    };
  }) as ReactiveQuery<TParams, TResult, E, TQueryKey>;
}
