import {
  type QueryClient,
  type QueryKey,
  queryOptions,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from '../Query/idiomatic/createIdiomaticQuery';
import { IdiomaticQuery } from '../Query/idiomatic/types';

// Overloads
export function IdiomaticQueryWithManagedStoreFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
  }: {
    getQueryOptions: () => ReturnType<
      typeof queryOptions<TResult, E, TResult, TQueryKey>
    >;
    getFromStore: () => TResult;
  },
): IdiomaticQuery<undefined, TResult, E, TQueryKey>;
export function IdiomaticQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
  }: {
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
    getFromStore: (args: TParams) => TResult;
  },
): IdiomaticQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function IdiomaticQueryWithManagedStoreFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
  }: {
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
    getFromStore: (args: TParams) => TResult;
  },
): IdiomaticQuery<TParams, TResult, E, TQueryKey> {
  return createIdiomaticQuery(async (paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const { queryFn, ...restQueryOptions } = getQueryOptions(params as TParams);

    if (options?.forceRefetch) {
      await queryClient.invalidateQueries({
        queryKey: restQueryOptions.queryKey,
      });
    }

    await queryClient.fetchQuery({
      ...restQueryOptions,
      // currently the only chimeric option is 'forceRefetch', which has no
      // equivalent in the idiomatic query options
      // ...options,
      ...nativeOptions,
      queryFn: async (): Promise<TResult> => {
        if (queryFn && typeof queryFn === 'function') {
          await queryFn(
            params as {
              client: QueryClient;
              queryKey: TQueryKey;
              signal: AbortSignal;
              meta: Record<string, unknown> | undefined;
              pageParam?: unknown;
              direction?: unknown;
            },
          );
        }
        return null as unknown as TResult;
      },
    });

    return getFromStore(params as TParams);
  }) as IdiomaticQuery<TParams, TResult, E, TQueryKey>;
}
