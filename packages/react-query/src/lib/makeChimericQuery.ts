import { QueryClient, useQuery, QueryOptions } from '@tanstack/react-query';
import { ChimericQuery } from '@chimeric/core';

export const MakeChimericQuery =
  (queryClient: QueryClient) =>
  <
    TParams,
    TResult,
    E extends Error,
    ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
      ? never
      : object,
  >({
    getQueryOptions,
    errorHelpers,
  }: {
    getQueryOptions: (
      args: TParams,
    ) => QueryOptions<TResult, E, TResult, string[]>;
    errorHelpers: ErrorHelpers;
  }): ChimericQuery<TParams, TResult, E, ErrorHelpers> => {
    return {
      call: async (args) => {
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

        return queryClient.fetchQuery({
          ...fetchQueryOptions,
          queryKey: queryOptions.queryKey,
          queryFn: queryOptions.queryFn,
        });
      },
      useQuery: (args) => {
        const { options, ...params } = args ?? {};
        const queryOptions = getQueryOptions(params as TParams);
        if (!queryOptions.queryKey) {
          throw new Error('queryKey is required');
        }
        const { isPending, isSuccess, isError, error, data } = useQuery<
          TResult,
          E,
          TResult,
          string[]
        >({
          queryFn: queryOptions.queryFn,
          queryKey: queryOptions.queryKey,
          ...queryOptions,
          ...options,
        });

        return {
          isPending,
          isSuccess,
          isError,
          error,
          data,
        };
      },
      errorHelpers,
    };
  };
