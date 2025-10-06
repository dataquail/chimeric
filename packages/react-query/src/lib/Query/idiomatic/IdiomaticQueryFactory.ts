import {
  QueryKey,
  queryOptions,
  type QueryClient,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from './createIdiomaticQuery';
import { IdiomaticQuery } from './types';

export function IdiomaticQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  getQueryOptions: (
    args: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  return createIdiomaticQuery(async (params, allOptions = {}) => {
    const { options, nativeOptions } = allOptions ?? {};
    const queryOptions = getQueryOptions(params);

    const fetchQueryOptions = {
      ...queryOptions,
      ...nativeOptions,
    };

    if (options?.forceRefetch && fetchQueryOptions.staleTime === undefined) {
      fetchQueryOptions.staleTime = 0;
    }

    return queryClient.fetchQuery(fetchQueryOptions);
  });
}
