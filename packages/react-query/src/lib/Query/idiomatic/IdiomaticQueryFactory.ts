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
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>,
): IdiomaticQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  const idiomaticQuery = async (
    paramsAndOptions: Parameters<
      IdiomaticQuery<
        TParams extends undefined ? void : TParams,
        TResult,
        TError,
        TQueryKey
      >
    >[0],
  ) => {
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
  };

  return createIdiomaticQuery(
    idiomaticQuery as IdiomaticQuery<
      TParams extends undefined ? void : TParams,
      TResult,
      TError,
      TQueryKey
    >,
  ) as IdiomaticQuery<
    TParams extends undefined ? void : TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
