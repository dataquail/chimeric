import { type QueryOptions, useQuery } from '@tanstack/react-query';
import {
  ReactiveQuery,
  ReactiveQueryOptions,
  isReactiveQuery,
} from '@chimeric/core';

// Overloads
export function ReactiveQueryFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  getQueryOptions: () => QueryOptions<TResult, E, TResult, string[]>,
): ReactiveQuery<void, TResult, E>;
export function ReactiveQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ReactiveQuery<TParams, TResult, E>;

// Implementation
export function ReactiveQueryFactory<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  getQueryOptions: (
    allParams: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ReactiveQuery<TParams, TResult, E> {
  const reactiveQuery = {
    useQuery: (
      paramsAndOptions?: TParams & { options?: ReactiveQueryOptions },
    ) => {
      const { options, ...params } = paramsAndOptions ?? {};
      const queryOptions = getQueryOptions(params as TParams);
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
    },
  };

  if (isReactiveQuery<TParams, TResult, E>(reactiveQuery)) {
    return reactiveQuery;
  } else {
    throw new Error('reactiveQuery is not qualified to be reactive query');
  }
}
