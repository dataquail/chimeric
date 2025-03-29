import {
  QueryClient,
  QueryOptions,
  useQuery as useTanstackQuery,
  UseQueryOptions,
  OmitKeyof,
} from '@tanstack/react-query';
import { ChimericQuery, fuseChimericQuery } from '@chimeric/core';

export const ChimericQueryWithManagedStoreFactory = <
  TParams,
  TResult,
  E extends Error,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
  },
): ChimericQuery<TParams, TResult, E> => {
  return fuseChimericQuery({
    fn: async (args) => {
      const { options, ...params } = args ?? {};
      const queryOptions = getQueryOptions(params as TParams);
      const optionsWithOverridesApplied = args?.options ?? {
        forceRefetch: false,
        ...options,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { forceRefetch, ...fetchQueryOptions } =
        optionsWithOverridesApplied;
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
    },
    useQuery: (args) => {
      const { options, ...params } = args ?? {};
      const queryOptions = getQueryOptions(params as TParams);
      if (!queryOptions.queryKey) {
        throw new Error('queryKey is required');
      }
      const { isPending, isSuccess, isError, error } = useTanstackQuery({
        ...(queryOptions as QueryOptions<unknown, E, unknown, string[]>),
        ...(options as UseQueryOptions<unknown, E, unknown, string[]>),
        queryFn: async () => {
          await queryFn(params as TParams);
          return null;
        },
      });

      return {
        isPending,
        isSuccess,
        isError,
        error,
        data: useFromStore(params as TParams),
      };
    },
  });
};
