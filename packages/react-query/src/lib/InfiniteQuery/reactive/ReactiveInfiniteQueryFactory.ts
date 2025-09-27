import {
  type QueryKey,
  useInfiniteQuery,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { type ReactiveInfiniteQuery } from './types';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';

export function ReactiveInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  getInfiniteQueryOptions: (
    params: TParams,
  ) => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >,
): ReactiveInfiniteQuery<
  TParams extends undefined ? void : TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> {
  const query = (
    paramsAndOptions: Parameters<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['use']
    >[0],
  ) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const query = useInfiniteQuery({
      ...getInfiniteQueryOptions(params as TParams),
      enabled: options?.enabled ?? true,
      ...nativeOptions,
    });

    return {
      isIdle: !query.isFetched,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: query.data
        ? {
            pages: query.data.pages,
            pageParams: query.data.pageParams,
          }
        : undefined,
      isFetchingNextPage: query.isFetchingNextPage,
      isFetchingPreviousPage: query.isFetchingPreviousPage,
      hasNextPage: query.hasNextPage ?? false,
      hasPreviousPage: query.hasPreviousPage ?? false,
      fetchNextPage: async () => {
        const result = await query.fetchNextPage();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      fetchPreviousPage: async () => {
        const result = await query.fetchPreviousPage();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      refetch: async () => {
        const result = await query.refetch();
        return {
          pages: result.data?.pages ?? [],
          pageParams: result.data?.pageParams ?? [],
        };
      },
      native: query,
    } as ReturnType<
      ReactiveInfiniteQuery<
        TParams,
        TPageData,
        TPageParam,
        TError,
        TQueryKey
      >['use']
    >;
  };

  return createReactiveInfiniteQuery(query) as ReactiveInfiniteQuery<
    TParams extends undefined ? void : TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
