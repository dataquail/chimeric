import { QueryClient, UseQueryOptions, OmitKeyof } from '@tanstack/react-query';
import { IdiomaticQuery, createIdiomaticQuery } from '@chimeric/core';
import { getParamsAndOptionsFromIdiomaticQuery } from '../utils';

export const IdiomaticQueryWithManagedStoreFactory = <
  TParams = void,
  TResult = unknown,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
  },
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

    await queryClient.fetchQuery({
      ...queryOptions,
      queryKey: queryOptions.queryKey,
      queryFn: async () => {
        await queryFn(params as TParams);
        return null;
      },
    });
    return getFromStore(params as TParams);
  });
};
