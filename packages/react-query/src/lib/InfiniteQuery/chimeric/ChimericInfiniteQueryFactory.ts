import {
  type QueryKey,
  type QueryClient,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { ReactiveInfiniteQueryFactory } from '../reactive/ReactiveInfiniteQueryFactory';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';

export function ChimericInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  queryClient: QueryClient;
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
  >;
}): ChimericInfiniteQuery<
  TParams extends undefined ? void : TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> {
  const { queryClient, getInfiniteQueryOptions } = args;

  const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >(queryClient, getInfiniteQueryOptions);

  const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >(getInfiniteQueryOptions);

  return fuseChimericInfiniteQuery({
    idiomatic: idiomaticInfiniteQuery,
    reactive: reactiveInfiniteQuery,
  }) as ChimericInfiniteQuery<
    TParams extends undefined ? void : TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
