import { type QueryOptions, useQuery } from '@tanstack/react-query';
import { createReactiveQuery, ReactiveQuery } from '@chimeric/core';
import { getParamsAndOptionsFromReactiveQuery } from '../utils';

export const ReactiveQueryFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  getQueryOptions: (
    allParams: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ReactiveQuery<TParams, TResult, E> => {
  return createReactiveQuery((paramsOrOptions, optionsOrNever) => {
    const { params, options } = getParamsAndOptionsFromReactiveQuery(
      paramsOrOptions,
      optionsOrNever,
    );

    const queryOptions = getQueryOptions(params);
    if (!queryOptions.queryKey) {
      throw new Error('queryKey is required');
    }
    const query = useQuery<TResult, E, TResult, string[]>({
      queryFn: queryOptions.queryFn,
      queryKey: queryOptions.queryKey,
      ...queryOptions,
      ...options,
    });

    return {
      isIdle: !query.isFetched,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: query.data,
      refetch: async () => (await query.refetch()).data as TResult,
    };
  });
};
