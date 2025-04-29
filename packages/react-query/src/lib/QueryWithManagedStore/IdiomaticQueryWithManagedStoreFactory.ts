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
  initialOptions: {
    getFromStore: () => TResult;
    getQueryOptions: () => ReturnType<
      typeof queryOptions<void, E, void, TQueryKey>
    >;
  },
): IdiomaticQuery<undefined, TResult, E, TQueryKey>;
export function IdiomaticQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  initialOptions: {
    getFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
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
  initialOptions: {
    getFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
  },
): IdiomaticQuery<TParams, TResult, E, TQueryKey> {
  return createIdiomaticQuery(async (paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const { getQueryOptions, getFromStore, ...restQueryOptions } =
      initialOptions;
    const { queryFn, queryKey, ...restInitialQueryOptions } = getQueryOptions(
      params as TParams,
    );

    if (options?.forceRefetch) {
      await queryClient.invalidateQueries({
        queryKey,
      });
    }

    await queryClient.fetchQuery({
      queryKey,
      ...(restInitialQueryOptions as Omit<
        ReturnType<
          (
            params: TParams,
          ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>
        >,
        'queryFn' | 'queryKey'
      >),
      ...restQueryOptions,
      // currently the only chimeric option is 'forceRefetch', which has no
      // equivalent in the idiomatic query options
      // ...options,
      ...nativeOptions,
      queryFn: async (context): Promise<TResult> => {
        if (queryFn && typeof queryFn === 'function') {
          await queryFn(context);
        }
        return null as unknown as TResult;
      },
    });

    return getFromStore(params as TParams);
  }) as IdiomaticQuery<TParams, TResult, E, TQueryKey>;
}
