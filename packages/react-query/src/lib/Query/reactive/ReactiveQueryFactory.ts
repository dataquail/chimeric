import { type QueryKey, useQuery, queryOptions } from '@tanstack/react-query';
import { type ReactiveQuery } from './types';
import { createReactiveQuery } from './createReactiveQuery';

export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>,
): ReactiveQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  const query = (
    paramsAndOptions: Parameters<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['useQuery']
    >[0],
  ) => {
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
    } as ReturnType<
      ReactiveQuery<TParams, TResult, TError, TQueryKey>['useQuery']
    >;
  };

  return createReactiveQuery(query) as ReactiveQuery<
    TParams extends undefined ? void : TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
