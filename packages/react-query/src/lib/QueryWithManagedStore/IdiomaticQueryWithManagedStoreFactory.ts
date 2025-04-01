import { QueryClient, UseQueryOptions, OmitKeyof } from '@tanstack/react-query';
import { IdiomaticQuery, createIdiomaticQuery } from '@chimeric/core';

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
    await queryClient.fetchQuery({
      ...fetchQueryOptions,
      queryKey: queryOptions.queryKey,
      queryFn: async () => {
        await queryFn(params as TParams);
        return null;
      },
    });
    return getFromStore(params as TParams);
  });
};
