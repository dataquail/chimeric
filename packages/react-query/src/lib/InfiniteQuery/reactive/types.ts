import {
  ReactiveInfiniteQuery as CoreReactiveInfiniteQuery,
  DefineReactiveInfiniteQuery as CoreDefineReactiveInfiniteQuery,
  InfiniteQueryObserverResult,
} from '@chimeric/core';

import {
  type UseInfiniteQueryResult,
  type UseSuspenseInfiniteQueryResult,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryOptions,
  type FetchInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';

export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>,
  TanstackInfiniteQueryReactivePrefetchNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
> &
  ReactiveInfiniteQuerySuspense<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveSuspenseNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveSuspenseReturnType<
      TPageData,
      TError,
      TPageParam
    >
  >;

export type DefineReactiveInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreDefineReactiveInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>,
  TanstackInfiniteQueryReactivePrefetchNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >
> &
  ReactiveInfiniteQuerySuspense<
    Parameters<T> extends [] ? void : Parameters<T>[0],
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveSuspenseNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveSuspenseReturnType<
      TPageData,
      TError,
      TPageParam
    >
  >;

export type ReactiveInfiniteQuerySuspenseReturn<
  TPageData,
  TPageParam,
  TNativeReturnType,
  TError extends Error = Error,
> = {
  isPending: false;
  isSuccess: boolean;
  isError: boolean;
  error: TError | null;
  data: {
    pages: TPageData[];
    pageParams: TPageParam[];
  };
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<TPageData, TPageParam>
  >;
  fetchPreviousPage: () => Promise<
    InfiniteQueryObserverResult<TPageData, TPageParam>
  >;
  refetch: () => Promise<InfiniteQueryObserverResult<TPageData, TPageParam>>;
  native: TNativeReturnType;
};

export type ReactiveInfiniteQuerySuspense<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeSuspenseOptions = unknown,
  TNativeSuspenseReturnType = unknown,
> = [TParams] extends [void]
  ? {
      useSuspenseHook: (allOptions?: {
        nativeOptions?: TNativeSuspenseOptions;
      }) => ReactiveInfiniteQuerySuspenseReturn<
        TPageData,
        TPageParam,
        TNativeSuspenseReturnType,
        TError
      >;
    }
  : [TParams] extends [undefined]
  ? {
      useSuspenseHook: (allOptions?: {
        nativeOptions?: TNativeSuspenseOptions;
      }) => ReactiveInfiniteQuerySuspenseReturn<
        TPageData,
        TPageParam,
        TNativeSuspenseReturnType,
        TError
      >;
    }
  : undefined extends TParams
  ? {
      useSuspenseHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          nativeOptions?: TNativeSuspenseOptions;
        },
      ) => ReactiveInfiniteQuerySuspenseReturn<
        TPageData,
        TPageParam,
        TNativeSuspenseReturnType,
        TError
      >;
    }
  : {
      useSuspenseHook: (
        params: TParams,
        allOptions?: {
          nativeOptions?: TNativeSuspenseOptions;
        },
      ) => ReactiveInfiniteQuerySuspenseReturn<
        TPageData,
        TPageParam,
        TNativeSuspenseReturnType,
        TError
      >;
    };

export type TanstackInfiniteQueryReactiveNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseInfiniteQueryOptions<
    TPageData,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TPageData,
    TQueryKey,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getNextPageParam'
  | 'getPreviousPageParam'
>;

export type TanstackInfiniteQueryReactiveReturnType<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
> = UseInfiniteQueryResult<InfiniteData<TPageData, TPageParam>, TError>;

export type TanstackInfiniteQueryReactiveSuspenseNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseSuspenseInfiniteQueryOptions<
    TPageData,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TPageData,
    TQueryKey,
    TPageParam
  >,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getNextPageParam'
  | 'getPreviousPageParam'
>;

export type TanstackInfiniteQueryReactiveSuspenseReturnType<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
> = UseSuspenseInfiniteQueryResult<InfiniteData<TPageData, TPageParam>, TError>;

export type TanstackInfiniteQueryReactivePrefetchNativeOptions<
  TPageData = unknown,
  TError extends Error = Error,
  TPageParam = unknown,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  FetchInfiniteQueryOptions<
    InfiniteData<TPageData, TPageParam>,
    TError,
    InfiniteData<TPageData, TPageParam>,
    TQueryKey
  >,
  | 'queryKey'
  | 'queryFn'
  | 'initialPageParam'
  | 'getNextPageParam'
  | 'getPreviousPageParam'
>;
