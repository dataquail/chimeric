import {
  infiniteQueryOptions,
  type QueryClient,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/svelte-query';
import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { ReactiveInfiniteQueryFactory } from '../reactive/ReactiveInfiniteQueryFactory.svelte';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';

// Required params
export function ChimericInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
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
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function ChimericInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getInfiniteQueryOptions: (
    params?: TParams,
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
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// No params
export function ChimericInfiniteQueryFactory<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getInfiniteQueryOptions: () => ReturnType<
    typeof infiniteQueryOptions<
      TPageData,
      TError,
      InfiniteData<TPageData>,
      TQueryKey,
      TPageParam
    >
  >;
}): ChimericInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function ChimericInfiniteQueryFactory<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getInfiniteQueryOptions,
}: {
  queryClient: QueryClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInfiniteQueryOptions: any;
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idiomatic = IdiomaticInfiniteQueryFactory({ queryClient, getInfiniteQueryOptions }) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactive = ReactiveInfiniteQueryFactory({ getInfiniteQueryOptions, queryClient }) as any;
  return fuseChimericInfiniteQuery({ idiomatic, reactive }) as ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;
}
