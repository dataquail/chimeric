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
>(
  queryClient: QueryClient,
  initialOptions: {
    getFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  },
): IdiomaticQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  const idiomaticQuery = async (
    paramsAndOptions: Parameters<
      IdiomaticQuery<TParams, TResult, TError, TQueryKey>
    >[0],
  ) => {
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
          ) => ReturnType<
            typeof queryOptions<TResult, TError, TResult, TQueryKey>
          >
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
  };

  return createIdiomaticQuery<TParams, TResult, TError, TQueryKey>(
    idiomaticQuery as IdiomaticQuery<TParams, TResult, TError, TQueryKey>,
  ) as IdiomaticQuery<
    TParams extends undefined ? void : TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
