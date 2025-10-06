import { type QueryKey, useQuery, queryOptions } from '@tanstack/react-query';
import { type ReactiveQuery } from './types';
import { createReactiveQuery } from './createReactiveQuery';

export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
}: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  return createReactiveQuery((params, queryAllOptions = {}) => {
    const { options, nativeOptions } = queryAllOptions;
    const query = useQuery({
      ...getQueryOptions(params),
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
  });
}
