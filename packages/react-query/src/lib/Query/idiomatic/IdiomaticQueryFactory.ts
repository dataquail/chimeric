import {
  QueryKey,
  queryOptions,
  type QueryClient,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from './createIdiomaticQuery';
import { IdiomaticQuery } from './types';

// Overloads
export function IdiomaticQueryFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, E, TResult, TQueryKey>
  >,
): IdiomaticQuery<undefined, TResult, E, TQueryKey>;
export function IdiomaticQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): IdiomaticQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function IdiomaticQueryFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): IdiomaticQuery<TParams, TResult, E, TQueryKey> {
  return createIdiomaticQuery(async (paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const queryOptions = getQueryOptions(params as TParams);

    const fetchQueryOptions = {
      ...queryOptions,
      ...nativeOptions,
    };

    if (options?.forceRefetch) {
      fetchQueryOptions.staleTime = 0;
    }

    return queryClient.fetchQuery(fetchQueryOptions);
  }) as IdiomaticQuery<TParams, TResult, E, TQueryKey>;
}
