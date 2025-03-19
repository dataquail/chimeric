import {
  QueryClient,
  QueryOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { ChimericQuery } from './ChimericQuery';

export const MakeChimericQueryWithManagedStore =
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
    getFromStore,
    useFromStore,
  }: {
    getQueryOptions: (
      args: TParams,
    ) => QueryOptions<unknown, E, TResult, string[]>;
    errorHelpers: ErrorHelpers;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
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
        await queryClient.fetchQuery({
          ...fetchQueryOptions,
          queryKey: queryOptions.queryKey,
          queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const queryFn = queryOptions.queryFn as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await queryFn(params as any);
            return null as unknown as TResult;
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
        const { isPending, isSuccess, isError, error } = useQuery<
          TResult,
          E,
          TResult,
          string[]
        >({
          ...(queryOptions as QueryOptions<TResult, E, TResult, string[]>),
          ...(options as UseQueryOptions<TResult, E, TResult, string[]>),
          queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const queryFn = queryOptions.queryFn as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await queryFn(params as any);
            return null as unknown as TResult;
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
      errorHelpers,
    };
  };
