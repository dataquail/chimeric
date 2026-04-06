import {
  type QueryKey,
  type QueryClient,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { createReactiveInfiniteQuery } from '../reactive/createReactiveInfiniteQuery';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';
import { throwHookServerError } from '../../serverErrors';

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
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  const idiomatic = IdiomaticInfiniteQueryFactory<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >({ queryClient, getInfiniteQueryOptions });
  const stubUseHook = () => throwHookServerError('useHook');
  const stubPrefetchHook = () => throwHookServerError('usePrefetchHook');
  const reactive = createReactiveInfiniteQuery(stubUseHook, stubPrefetchHook);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fuseChimericInfiniteQuery({ idiomatic, reactive } as any) as ChimericInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}
