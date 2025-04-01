import { type QueryClient, type QueryOptions } from '@tanstack/react-query';
import { IdiomaticQuery, createIdiomaticQuery } from '@chimeric/core';

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
  return createIdiomaticQuery(async (args) => {
    const { options, ...params } = args ?? {};
    const queryOptions = getQueryOptions(params as TParams);
    const optionsWithOverridesApplied = args?.options ?? {
      forceRefetch: false,
      ...options,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { forceRefetch, ...fetchQueryOptions } = optionsWithOverridesApplied;
    if (optionsWithOverridesApplied.forceRefetch) {
      await queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
    }

    if (!queryOptions.queryKey) {
      throw new Error('queryKey is required');
    }

    return queryClient.fetchQuery({
      ...fetchQueryOptions,
      queryKey: queryOptions.queryKey,
      queryFn: queryOptions.queryFn,
    });
  });
};
