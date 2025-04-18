import { type QueryClient, type QueryOptions } from '@tanstack/react-query';
import {
  IdiomaticQuery,
  IdiomaticQueryOptions,
  isIdiomaticQuery,
} from '@chimeric/core';

// Overloads
export function IdiomaticQueryFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: () => QueryOptions<TResult, E, TResult, string[]>,
): IdiomaticQuery<undefined, TResult>;
export function IdiomaticQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): IdiomaticQuery<TParams, TResult>;

// Implementation
export function IdiomaticQueryFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): IdiomaticQuery<TParams, TResult> {
  const idiomaticQuery = async (
    paramsAndOptions?: TParams & { options?: IdiomaticQueryOptions },
  ) => {
    const { options, ...params } = paramsAndOptions ?? {};
    const queryOptions = getQueryOptions(params as TParams);
    if (options?.forceRefetch) {
      await queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
    }

    if (!queryOptions.queryKey) {
      throw new Error('queryKey is required');
    }

    return queryClient.fetchQuery({
      ...queryOptions,
      queryKey: queryOptions.queryKey,
      queryFn: queryOptions.queryFn,
    });
  };

  if (isIdiomaticQuery<TParams, TResult>(idiomaticQuery)) {
    return idiomaticQuery;
  } else {
    throw new Error('idiomaticQuery is not qualified to be idiomatic query');
  }
}
