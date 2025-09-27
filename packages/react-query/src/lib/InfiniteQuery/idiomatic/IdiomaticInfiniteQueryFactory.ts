import {
  QueryKey,
  infiniteQueryOptions,
  type QueryClient,
  type InfiniteData,
  type FetchInfiniteQueryOptions,
} from '@tanstack/react-query';
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';
import { IdiomaticInfiniteQuery } from './types';

export function IdiomaticInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getInfiniteQueryOptions: (
    args: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >,
): IdiomaticInfiniteQuery<
  TParams extends undefined ? void : TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> {
  const idiomaticInfiniteQuery = async (
    paramsAndOptions: Parameters<
      IdiomaticInfiniteQuery<
        TParams extends undefined ? void : TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >
    >[0],
  ) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const infiniteOptions = getInfiniteQueryOptions(params as TParams);

    const fetchOptions: FetchInfiniteQueryOptions<
      InfiniteData<TPageData, TPageParam>,
      TError,
      TPageData,
      TQueryKey,
      TPageParam
    > = {
      ...infiniteOptions,
      ...nativeOptions,
    } as FetchInfiniteQueryOptions<
      InfiniteData<TPageData, TPageParam>,
      TError,
      TPageData,
      TQueryKey,
      TPageParam
    >;

    if (options?.forceRefetch) {
      fetchOptions.staleTime = 0;
    }

    if (options?.pageParam) {
      fetchOptions.initialPageParam = options.pageParam;
    }

    const result = await queryClient.fetchInfiniteQuery(fetchOptions);

    return {
      pages: result.pages,
      pageParams: result.pageParams,
    };
  };

  return createIdiomaticInfiniteQuery(
    idiomaticInfiniteQuery as IdiomaticInfiniteQuery<
      TParams extends undefined ? void : TParams,
      TPageData,
      TPageParam,
      TError,
      TQueryKey
    >,
  ) as IdiomaticInfiniteQuery<
    TParams extends undefined ? void : TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
