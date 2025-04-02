import { type QueryClient, type QueryOptions } from '@tanstack/react-query';
import { IdiomaticQuery, createIdiomaticQuery } from '@chimeric/core';
import { getParamsAndOptionsFromIdiomaticQuery } from '../utils';

export const IdiomaticQueryFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): IdiomaticQuery<TParams, TResult> => {
  return createIdiomaticQuery(async (paramsOrOptions, optionsOrNever) => {
    const { params, options } = getParamsAndOptionsFromIdiomaticQuery(
      paramsOrOptions,
      optionsOrNever,
    );
    const queryOptions = getQueryOptions(params as TParams);
    if (options.forceRefetch) {
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
  });
};
