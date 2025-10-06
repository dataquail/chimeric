import {
  type QueryClient,
  type QueryKey,
  queryOptions,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from '../Query/idiomatic/createIdiomaticQuery';
import { IdiomaticQuery } from '../Query/idiomatic/types';

export function IdiomaticQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getQueryOptions,
  getFromStore,
}: {
  queryClient: QueryClient;
  getFromStore: (params: TParams) => TResult;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  return createIdiomaticQuery(
    async (params, { options, nativeOptions } = {}) => {
      const { queryFn, queryKey, ...restInitialQueryOptions } =
        getQueryOptions(params);

      let chimericOptions: { staleTime?: number } = {};

      if (options?.forceRefetch) {
        chimericOptions.staleTime = 0;
      }

      await queryClient.fetchQuery({
        queryKey,
        ...(restInitialQueryOptions as Omit<
          ReturnType<
            (
              params: TParams,
            ) => ReturnType<
              typeof queryOptions<TResult, TError, TResult, TQueryKey>
            >
          >,
          'queryFn' | 'queryKey'
        >),
        ...chimericOptions,
        ...nativeOptions,
        queryFn: async (context): Promise<TResult> => {
          if (queryFn && typeof queryFn === 'function') {
            await queryFn(context);
          }
          return null as unknown as TResult;
        },
      });

      return getFromStore(params);
    },
  );
}
